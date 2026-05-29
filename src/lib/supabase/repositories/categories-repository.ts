import type { SupabaseClient } from "@supabase/supabase-js";
import type { SectionId } from "@/types/section";

/**
 * 레시피 저장 시 카테고리 이름 → categories.id
 * - 기본 카테고리명이면 is_default 행 사용
 * - '기타' 직접 입력 등은 유저 커스텀 행을 찾거나 생성
 */
export async function resolveCategoryId(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
  categoryName: string,
): Promise<string> {
  const name = categoryName.trim();
  if (!name) {
    throw new Error("카테고리를 입력해주세요.");
  }

  const { data: defaultCat, error: defErr } = await client
    .from("categories")
    .select("id")
    .eq("section", section)
    .eq("name", name)
    .eq("is_default", true)
    .maybeSingle();

  if (defErr) throw defErr;
  if (defaultCat) return defaultCat.id;

  const { data: existing, error: findErr } = await client
    .from("categories")
    .select("id")
    .eq("section", section)
    .eq("name", name)
    .eq("user_id", userId)
    .eq("is_default", false)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing.id;

  const { data: created, error: insErr } = await client
    .from("categories")
    .insert({
      section,
      name,
      is_default: false,
      user_id: userId,
      sort_order: 99,
    })
    .select("id")
    .single();

  if (insErr) {
    if (insErr.code === "23505") {
      const { data: retry, error: retryErr } = await client
        .from("categories")
        .select("id")
        .eq("section", section)
        .eq("name", name)
        .eq("user_id", userId)
        .single();
      if (retryErr) throw retryErr;
      return retry.id;
    }
    throw insErr;
  }

  return created.id;
}

export async function listCategoryNames(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
): Promise<string[]> {
  const { data, error } = await client
    .from("categories")
    .select("name, is_default, sort_order")
    .eq("section", section)
    .or(`is_default.eq.true,user_id.eq.${userId}`)
    .order("is_default", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const names: string[] = [];
  const seen = new Set<string>();
  for (const row of data ?? []) {
    if (!seen.has(row.name)) {
      seen.add(row.name);
      names.push(row.name);
    }
  }
  return names;
}

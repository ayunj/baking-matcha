import type { SupabaseClient } from "@supabase/supabase-js";
import type { PantryItem } from "@/types/pantry";
import type { SectionId } from "@/types/section";
import type { DbPantryRow } from "@/lib/supabase/db-types";
import { pantryFromRow, pantryToInsert, pantryToUpdate } from "@/lib/supabase/mappers";

export async function listPantry(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
): Promise<PantryItem[]> {
  const { data, error } = await client
    .from("pantry")
    .select("id, user_id, section, name, quantity, category, is_low, created_at")
    .eq("user_id", userId)
    .eq("section", section)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbPantryRow[]).map(pantryFromRow);
}

export async function createPantryItem(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
  data: Omit<PantryItem, "id">,
): Promise<PantryItem> {
  const { data: row, error } = await client
    .from("pantry")
    .insert(pantryToInsert(userId, section, data))
    .select("id, user_id, section, name, quantity, category, is_low, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("같은 이름의 재료가 이미 이 섹션에 있어요.");
    }
    throw error;
  }
  return pantryFromRow(row as DbPantryRow);
}

export async function updatePantryItem(
  client: SupabaseClient,
  itemId: string,
  data: Omit<PantryItem, "id">,
): Promise<PantryItem> {
  const { data: row, error } = await client
    .from("pantry")
    .update(pantryToUpdate(data))
    .eq("id", itemId)
    .select("id, user_id, section, name, quantity, category, is_low, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("같은 이름의 재료가 이미 이 섹션에 있어요.");
    }
    throw error;
  }
  return pantryFromRow(row as DbPantryRow);
}

export async function deletePantryItem(
  client: SupabaseClient,
  itemId: string,
): Promise<void> {
  const { error } = await client.from("pantry").delete().eq("id", itemId);
  if (error) throw error;
}

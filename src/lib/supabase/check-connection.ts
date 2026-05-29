import type { PostgrestError } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ConnectionCheckResult =
  | { ok: true; tablesReady: boolean }
  | { ok: false; message: string };

function isMissingTableError(error: PostgrestError): boolean {
  const code = error.code ?? "";
  const msg = error.message ?? "";
  if (code === "PGRST205" || code === "42P01") return true;
  return (
    msg.includes("does not exist") ||
    msg.includes("Could not find the table") ||
    msg.includes("schema cache")
  );
}

/** URL·키 유효성 확인 (테이블 없어도 연동 성공으로 처리) */
export async function checkSupabaseConnection(
  client: SupabaseClient,
): Promise<ConnectionCheckResult> {
  const { error: authError } = await client.auth.getSession();
  if (authError) {
    return { ok: false, message: authError.message };
  }

  const { error: tableError } = await client
    .from("recipes")
    .select("id", { count: "exact", head: true });

  if (!tableError) {
    return { ok: true, tablesReady: true };
  }

  if (isMissingTableError(tableError)) {
    return { ok: true, tablesReady: false };
  }

  return { ok: false, message: tableError.message };
}

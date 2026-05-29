import bcrypt from "bcryptjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppUser } from "@/data/mock-data";
import type { DbUserRow } from "@/lib/supabase/db-types";

const BCRYPT_ROUNDS = 10;

export async function findUserByUsername(
  client: SupabaseClient,
  username: string,
): Promise<DbUserRow | null> {
  const { data, error } = await client
    .from("users")
    .select("id, username, password, name")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function isUsernameTaken(
  client: SupabaseClient,
  username: string,
): Promise<boolean> {
  const row = await findUserByUsername(client, username);
  return row != null;
}

export async function createUser(
  client: SupabaseClient,
  name: string,
  username: string,
  plainPassword: string,
): Promise<AppUser> {
  const password = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
  const { data, error } = await client
    .from("users")
    .insert({ username, password, name })
    .select("id, username, name")
    .single();

  if (error) throw error;
  return { id: data.username, dbId: data.id, name: data.name };
}

export async function loginUser(
  client: SupabaseClient,
  username: string,
  plainPassword: string,
): Promise<AppUser | null> {
  const row = await findUserByUsername(client, username);
  if (!row) return null;

  const ok = await bcrypt.compare(plainPassword, row.password);
  if (!ok) return null;

  return { id: row.username, dbId: row.id, name: row.name };
}

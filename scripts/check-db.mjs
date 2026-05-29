/**
 * 로컬 .env.local 기준 Supabase 연결·테이블 프로브 (npm run check:db)
 */
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const ENV_PATH = ".env.local";

function loadEnvLocal() {
  if (!existsSync(ENV_PATH)) {
    console.error(`❌ ${ENV_PATH} 없음 — copy .env.example .env.local 후 URL·키 입력`);
    process.exit(1);
  }
  for (const line of readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function isPlaceholder(url, key) {
  return (
    !url?.trim() ||
    !key?.trim() ||
    url.includes("your-project") ||
    key.includes("your_key")
  );
}

function isMissingTableError(error) {
  const code = error?.code;
  const msg = error?.message ?? "";
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    /does not exist|relation.*not found/i.test(msg)
  );
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (isPlaceholder(url, key)) {
  console.error("❌ .env.local에 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 를 채워 주세요.");
  process.exit(1);
}

const client = createClient(url, key);

const { error: authError } = await client.auth.getSession();
if (authError) {
  console.error("❌ Auth 프로브 실패:", authError.message);
  process.exit(1);
}

const { error: tableError } = await client
  .from("recipes")
  .select("id", { count: "exact", head: true });

if (!tableError) {
  console.log("✅ DB 연결됨 · recipes 테이블 OK → npm run dev 후 화면에서 「DB 연결됨」 확인");
  process.exit(0);
}

if (isMissingTableError(tableError)) {
  console.log("⚠️ DB 연결됨 · recipes 테이블 없음");
  console.log("   Supabase SQL Editor에서 supabase/migrations/20250529000000_initial.sql 실행 후 다시 npm run check:db");
  process.exit(0);
}

console.error("❌ recipes 프로브 실패:", tableError.message);
process.exit(1);

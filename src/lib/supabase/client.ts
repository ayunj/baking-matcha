"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null = null;

/** 브라우저용 Supabase 클라이언트 (싱글톤, 클라이언트 전용) */
export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (typeof window === "undefined") return null;
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    const { createClient } = await import("@supabase/supabase-js");
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return browserClient;
}

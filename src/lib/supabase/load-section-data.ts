import type { SupabaseClient } from "@supabase/supabase-js";
import type { SectionData } from "@/data/mock-data";
import { listPantry } from "@/lib/supabase/repositories/pantry-repository";
import { listRecipes } from "@/lib/supabase/repositories/recipes-repository";
import { SECTION_IDS, type SectionId } from "@/types/section";

export async function loadAllSectionData(
  client: SupabaseClient,
  userId: string,
): Promise<Record<SectionId, SectionData>> {
  const pairs = await Promise.all(
    SECTION_IDS.map(async (section) => {
      const [recipes, pantry] = await Promise.all([
        listRecipes(client, userId, section),
        listPantry(client, userId, section),
      ]);
      return [section, { recipes, pantry }] as const;
    }),
  );

  return Object.fromEntries(pairs) as Record<SectionId, SectionData>;
}

export async function loadSectionData(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
): Promise<SectionData> {
  const [recipes, pantry] = await Promise.all([
    listRecipes(client, userId, section),
    listPantry(client, userId, section),
  ]);
  return { recipes, pantry };
}

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Recipe } from "@/types/recipe";
import type { SectionId } from "@/types/section";
import type { DbRecipeRow } from "@/lib/supabase/db-types";
import {
  ingredientsToRows,
  recipeFromRow,
  recipeToInsert,
  recipeToUpdate,
  stepsToRows,
  type RecipeWriteInput,
} from "@/lib/supabase/mappers";
import { resolveCategoryId } from "@/lib/supabase/repositories/categories-repository";

const RECIPE_SELECT = `
  id,
  user_id,
  section,
  category_id,
  emoji,
  name,
  serving,
  oven_preheat,
  oven_temp,
  oven_time,
  note,
  created_at,
  categories ( name ),
  recipe_ingredients ( sort_order, content ),
  recipe_steps ( sort_order, description, memo )
`;

async function fetchRecipe(
  client: SupabaseClient,
  recipeId: string,
): Promise<Recipe> {
  const { data, error } = await client
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("id", recipeId)
    .single();

  if (error) throw error;
  return recipeFromRow(data as DbRecipeRow);
}

async function replaceChildren(
  client: SupabaseClient,
  recipeId: string,
  data: RecipeWriteInput,
): Promise<void> {
  const { error: delIng } = await client
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", recipeId);
  if (delIng) throw delIng;

  const { error: delSteps } = await client
    .from("recipe_steps")
    .delete()
    .eq("recipe_id", recipeId);
  if (delSteps) throw delSteps;

  const ingRows = ingredientsToRows(recipeId, data.ingredients);
  if (ingRows.length > 0) {
    const { error } = await client.from("recipe_ingredients").insert(ingRows);
    if (error) throw error;
  }

  const stepRows = stepsToRows(recipeId, data.steps);
  if (stepRows.length > 0) {
    const { error } = await client.from("recipe_steps").insert(stepRows);
    if (error) throw error;
  }
}

export async function listRecipes(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
): Promise<Recipe[]> {
  const { data, error } = await client
    .from("recipes")
    .select(RECIPE_SELECT)
    .eq("user_id", userId)
    .eq("section", section)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbRecipeRow[]).map(recipeFromRow);
}

export async function createRecipe(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
  data: RecipeWriteInput,
): Promise<Recipe> {
  const categoryId = await resolveCategoryId(
    client,
    userId,
    section,
    data.cat,
  );

  const { data: row, error } = await client
    .from("recipes")
    .insert(recipeToInsert(userId, section, categoryId, data))
    .select("id")
    .single();

  if (error) throw error;
  await replaceChildren(client, row.id, data);
  return fetchRecipe(client, row.id);
}

export async function updateRecipe(
  client: SupabaseClient,
  userId: string,
  section: SectionId,
  recipeId: string,
  data: RecipeWriteInput,
): Promise<Recipe> {
  const categoryId = await resolveCategoryId(
    client,
    userId,
    section,
    data.cat,
  );

  const { error } = await client
    .from("recipes")
    .update(recipeToUpdate(data, categoryId))
    .eq("id", recipeId);

  if (error) throw error;
  await replaceChildren(client, recipeId, data);
  return fetchRecipe(client, recipeId);
}

export async function deleteRecipe(
  client: SupabaseClient,
  recipeId: string,
): Promise<void> {
  const { error } = await client.from("recipes").delete().eq("id", recipeId);
  if (error) throw error;
}

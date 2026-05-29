import type { PantryItem } from "@/types/pantry";
import type { Recipe } from "@/types/recipe";
import type { DbPantryRow, DbRecipeRow } from "@/lib/supabase/db-types";

function sortByOrder<T extends { sort_order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

function categoryNameFromRow(row: DbRecipeRow): string {
  const c = row.categories;
  if (!c) return "";
  if (Array.isArray(c)) return c[0]?.name ?? "";
  return c.name;
}

export function recipeFromRow(row: DbRecipeRow): Recipe {
  const ingredients = sortByOrder(row.recipe_ingredients ?? []).map(
    (i) => i.content,
  );
  const steps = sortByOrder(row.recipe_steps ?? []).map((s) => ({
    text: s.description,
    memo: s.memo ?? "",
  }));

  return {
    id: row.id,
    categoryId: row.category_id,
    emoji: row.emoji,
    name: row.name,
    cat: categoryNameFromRow(row),
    serving: row.serving ?? "",
    preheat: row.oven_preheat,
    bakeTemp: row.oven_temp,
    bakeTime: row.oven_time,
    ingredients,
    steps,
    note: row.note ?? "",
    createdAt: new Date(row.created_at).getTime(),
  };
}

export function pantryFromRow(row: DbPantryRow): PantryItem {
  return {
    id: row.id,
    name: row.name,
    qty: row.quantity ?? "",
    cat: row.category ?? "",
    low: row.is_low,
  };
}

export type RecipeWriteInput = Omit<Recipe, "id" | "createdAt">;

export function recipeToInsert(
  userId: string,
  section: DbRecipeRow["section"],
  categoryId: string,
  data: RecipeWriteInput,
) {
  return {
    user_id: userId,
    section,
    category_id: categoryId,
    emoji: data.emoji,
    name: data.name,
    serving: data.serving || null,
    oven_preheat: data.preheat,
    oven_temp: data.bakeTemp,
    oven_time: data.bakeTime,
    note: data.note || null,
  };
}

export function recipeToUpdate(data: RecipeWriteInput, categoryId: string) {
  return {
    category_id: categoryId,
    emoji: data.emoji,
    name: data.name,
    serving: data.serving || null,
    oven_preheat: data.preheat,
    oven_temp: data.bakeTemp,
    oven_time: data.bakeTime,
    note: data.note || null,
  };
}

export function ingredientsToRows(recipeId: string, ingredients: string[]) {
  return ingredients.map((content, sort_order) => ({
    recipe_id: recipeId,
    sort_order,
    content,
  }));
}

export function stepsToRows(
  recipeId: string,
  steps: { text: string; memo: string }[],
) {
  return steps.map((step, sort_order) => ({
    recipe_id: recipeId,
    sort_order,
    description: step.text,
    memo: step.memo || null,
  }));
}

export function pantryToInsert(
  userId: string,
  section: DbPantryRow["section"],
  data: Omit<PantryItem, "id">,
) {
  return {
    user_id: userId,
    section,
    name: data.name,
    quantity: data.qty || null,
    category: data.cat || null,
    is_low: data.low,
  };
}

export function pantryToUpdate(data: Omit<PantryItem, "id">) {
  return {
    name: data.name,
    quantity: data.qty || null,
    category: data.cat || null,
    is_low: data.low,
  };
}

import type { SectionId } from "@/types/section";

export type DbIngredientRow = {
  sort_order: number;
  content: string;
};

export type DbStepRow = {
  sort_order: number;
  description: string;
  memo: string | null;
};

export type DbCategoryJoin = {
  name: string;
};

export type DbRecipeRow = {
  id: string;
  user_id: string;
  section: SectionId;
  category_id: string;
  categories: DbCategoryJoin | DbCategoryJoin[] | null;
  emoji: string;
  name: string;
  serving: string | null;
  oven_preheat: number | null;
  oven_temp: number | null;
  oven_time: number | null;
  note: string | null;
  created_at: string;
  recipe_ingredients: DbIngredientRow[] | null;
  recipe_steps: DbStepRow[] | null;
};

export type DbPantryRow = {
  id: string;
  user_id: string;
  section: SectionId;
  name: string;
  quantity: string | null;
  category: string | null;
  is_low: boolean;
  created_at: string;
};

export type DbUserRow = {
  id: string;
  username: string;
  password: string;
  name: string;
};

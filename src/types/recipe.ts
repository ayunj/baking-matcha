export type RecipeStep = {
  text: string;
  memo: string;
};

export type Recipe = {
  id: number;
  emoji: string;
  name: string;
  cat: string;
  serving: string;
  preheat: number | null;
  bakeTemp: number | null;
  bakeTime: number | null;
  ingredients: string[];
  steps: RecipeStep[];
  note: string;
  createdAt: number;
};

export const RECIPE_CATEGORIES = [
  "케이크",
  "쿠키",
  "빵",
  "파이/타르트",
  "머핀",
  "기타",
] as const;

export const PRESET_RECIPE_CATS = [...RECIPE_CATEGORIES];

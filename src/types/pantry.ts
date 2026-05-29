export type PantryItem = {
  id: number;
  name: string;
  qty: string;
  cat: string;
  low: boolean;
};

export const PANTRY_CATEGORIES = [
  "밀가루류",
  "당류",
  "유제품",
  "달걀",
  "오일/버터",
  "팽창제",
  "견과류",
  "초콜릿",
  "과일",
  "기타",
] as const;

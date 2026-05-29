import type { PantryItem } from "@/types/pantry";
import type { Recipe } from "@/types/recipe";

const day = 86400000;

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 1,
    emoji: "🧁",
    name: "바닐라 컵케이크",
    cat: "머핀",
    serving: "12개",
    preheat: 175,
    bakeTemp: 175,
    bakeTime: 22,
    steps: [
      { text: "오븐을 175°C로 예열하세요.", memo: "" },
      {
        text: "버터와 설탕을 부드럽게 크림화하세요.",
        memo: "실온 버터를 꼭 사용하세요.",
      },
      { text: "달걀을 하나씩 넣으며 섞으세요.", memo: "" },
      { text: "가루류를 체 쳐서 번갈아 넣으세요.", memo: "" },
      {
        text: "컵케이크 틀에 2/3 채우고 22분 굽세요.",
        memo: "이쑤시개로 찔러 반죽이 안 묻으면 완성.",
      },
    ],
    ingredients: [
      "박력분 200g",
      "설탕 150g",
      "버터 115g",
      "달걀 2개",
      "우유 120ml",
      "바닐라 에센스 1.5tsp",
      "베이킹파우더 1/2tsp",
    ],
    note: "생크림 프로스팅 올리면 더 맛있어요.",
    createdAt: Date.now() - day * 3,
  },
  {
    id: 2,
    emoji: "🍫",
    name: "퍼지 브라우니",
    cat: "케이크",
    serving: "16조각",
    preheat: 180,
    bakeTemp: 180,
    bakeTime: 25,
    steps: [
      { text: "오븐 180°C 예열, 틀에 유산지 깔기.", memo: "" },
      {
        text: "초콜릿과 버터를 중탕으로 녹이기.",
        memo: "약불에서 천천히 녹여야 분리되지 않아요.",
      },
      { text: "설탕 넣고 섞은 뒤 달걀을 하나씩.", memo: "" },
      {
        text: "가루류 폴딩 후 틀에 붓기.",
        memo: "과도하게 섞으면 글루텐이 생겨요.",
      },
      { text: "25분 굽고 완전히 식혀 자르기.", memo: "" },
    ],
    ingredients: [
      "다크초콜릿 200g",
      "버터 115g",
      "설탕 200g",
      "달걀 3개",
      "박력분 100g",
      "코코아 파우더 30g",
    ],
    note: "냉장 보관 후 먹으면 더 쫀득해요.",
    createdAt: Date.now() - day,
  },
];

export const INITIAL_PANTRY: PantryItem[] = [
  { id: 1, name: "박력분", qty: "1kg", cat: "밀가루류", low: false },
  { id: 2, name: "버터", qty: "200g", cat: "오일/버터", low: true },
  { id: 3, name: "달걀", qty: "6개", cat: "달걀", low: false },
  { id: 4, name: "설탕", qty: "500g", cat: "당류", low: false },
  { id: 5, name: "베이킹파우더", qty: "50g", cat: "팽창제", low: true },
];

export const EMOJIS = [
  "🍰",
  "🎂",
  "🍩",
  "🍪",
  "🥐",
  "🧁",
  "🍞",
  "🥧",
  "🫐",
  "🍫",
  "🥮",
  "🍮",
  "🫖",
  "🍬",
];

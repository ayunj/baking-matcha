import type { PantryItem } from "@/types/pantry";
import type { Recipe } from "@/types/recipe";
import type { SectionId } from "@/types/section";

const day = 86400000;

export type AppUser = {
  /** 로그인 아이디 (username) */
  id: string;
  /** Supabase users.id (UUID) */
  dbId?: string;
  name: string;
  /** mock 로그인용 — DB 연동 시 미사용 */
  pw?: string;
};

export type SectionData = {
  recipes: Recipe[];
  pantry: PantryItem[];
};

export const INITIAL_USERS: AppUser[] = [
  { id: "admin", pw: "1234", name: "관리자" },
  { id: "user1", pw: "pass1", name: "홍길동" },
];

export const INITIAL_SECTION_DATA: Record<SectionId, SectionData> = {
  baking: {
    recipes: [
      {
        id: "1",
        emoji: "🧁",
        name: "바닐라 컵케이크",
        cat: "머핀",
        serving: "12개",
        preheat: 175,
        bakeTemp: 175,
        bakeTime: 22,
        ingredients: [
          "박력분 200g",
          "설탕 150g",
          "버터 115g",
          "달걀 2개",
          "우유 120ml",
        ],
        steps: [
          { text: "오븐 175°C 예열.", memo: "" },
          { text: "버터+설탕 크림화.", memo: "실온 버터 사용." },
          { text: "달걀 하나씩 추가.", memo: "" },
          { text: "가루류 체쳐 넣기.", memo: "" },
          { text: "22분 굽기.", memo: "이쑤시개 테스트." },
        ],
        note: "생크림 프로스팅 추천.",
        createdAt: Date.now() - day * 2,
      },
      {
        id: "2",
        emoji: "🍫",
        name: "퍼지 브라우니",
        cat: "케이크",
        serving: "16조각",
        preheat: 180,
        bakeTemp: 180,
        bakeTime: 25,
        ingredients: [
          "다크초콜릿 200g",
          "버터 115g",
          "설탕 200g",
          "달걀 3개",
          "박력분 100g",
        ],
        steps: [
          { text: "오븐 180°C 예열.", memo: "" },
          { text: "초콜릿+버터 중탕.", memo: "약불 사용." },
          { text: "달걀 하나씩.", memo: "" },
          { text: "가루 폴딩.", memo: "" },
          { text: "25분 굽기.", memo: "" },
        ],
        note: "냉장 후 더 맛있어요.",
        createdAt: Date.now() - day,
      },
    ],
    pantry: [
      { id: "1", name: "박력분", qty: "1kg", cat: "밀가루류", low: false },
      { id: "2", name: "버터", qty: "200g", cat: "오일/버터", low: true },
      { id: "3", name: "설탕", qty: "500g", cat: "당류", low: false },
      { id: "4", name: "달걀", qty: "6개", cat: "달걀", low: false },
      { id: "5", name: "베이킹파우더", qty: "50g", cat: "팽창제", low: true },
    ],
  },
  food: {
    recipes: [
      {
        id: "1",
        emoji: "🍳",
        name: "김치찌개",
        cat: "한식",
        serving: "2인분",
        preheat: null,
        bakeTemp: null,
        bakeTime: null,
        ingredients: ["김치 300g", "돼지고기 150g", "두부 1/2모", "대파 1대"],
        steps: [
          { text: "돼지고기 볶기.", memo: "기름 없이." },
          { text: "김치 넣고 볶기.", memo: "" },
          { text: "물 600ml 붓고 끓이기.", memo: "" },
          { text: "두부, 대파 추가 후 5분.", memo: "" },
        ],
        note: "묵은지로 하면 더 깊어요.",
        createdAt: Date.now() - day,
      },
    ],
    pantry: [
      { id: "1", name: "고춧가루", qty: "200g", cat: "양념/소스", low: false },
      { id: "2", name: "된장", qty: "500g", cat: "양념/소스", low: false },
    ],
  },
  drink: {
    recipes: [
      {
        id: "1",
        emoji: "☕",
        name: "달고나 커피",
        cat: "커피",
        serving: "1잔",
        preheat: null,
        bakeTemp: null,
        bakeTime: null,
        ingredients: [
          "인스턴트 커피 2tbsp",
          "설탕 2tbsp",
          "뜨거운 물 2tbsp",
          "우유 200ml",
        ],
        steps: [
          { text: "커피+설탕+물 400번 젓기.", memo: "전동 거품기 가능." },
          { text: "우유를 잔에 붓기.", memo: "" },
          { text: "위에 거품 올리기.", memo: "" },
        ],
        note: "얼음 추가하면 아이스.",
        createdAt: Date.now() - day,
      },
    ],
    pantry: [
      { id: "1", name: "인스턴트 커피", qty: "100g", cat: "기타", low: true },
      { id: "2", name: "우유", qty: "1L", cat: "유제품", low: false },
    ],
  },
};

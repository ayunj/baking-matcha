export type SectionId = "baking" | "food" | "drink";

export const SECTION_IDS: SectionId[] = ["baking", "food", "drink"];

export type SectionConfig = {
  title: string;
  desc: string;
  icon: string;
  cats: readonly string[];
  showOven: boolean;
};

export const SECTIONS: Record<SectionId, SectionConfig> = {
  baking: {
    title: "베이킹노트",
    desc: "케이크, 쿠키, 빵, 머핀",
    icon: "🧁",
    cats: ["케이크", "쿠키", "빵", "파이/타르트", "머핀", "기타"],
    showOven: true,
  },
  food: {
    title: "음식 레시피",
    desc: "한식, 중식, 일식, 양식",
    icon: "🍳",
    cats: ["한식", "중식", "일식", "양식", "동남아", "기타"],
    showOven: false,
  },
  drink: {
    title: "음료 레시피",
    desc: "커피, 티, 스무디, 에이드",
    icon: "🥤",
    cats: ["커피", "티", "스무디", "에이드", "주스", "기타"],
    showOven: false,
  },
};

export const SECTION_EMOJIS: Record<SectionId, readonly string[]> = {
  baking: ["🍰", "🎂", "🍩", "🍪", "🥐", "🧁", "🍞", "🥧", "🫐", "🍫", "🥮", "🍮"],
  food: ["🍳", "🥘", "🍜", "🍱", "🥗", "🍲", "🥩", "🍛", "🍣", "🥟", "🫕", "🍝"],
  drink: ["☕", "🍵", "🧋", "🥤", "🍹", "🧃", "🍶", "🫖", "🥛", "🍺", "🧊", "🍷"],
};

export const HOME_CATEGORIES: {
  id: SectionId;
  title: string;
  desc: string;
  icon: string;
  iconClass: string;
}[] = [
  {
    id: "baking",
    title: "베이킹",
    desc: "케이크, 쿠키, 빵, 머핀",
    icon: "🧁",
    iconClass: "ciBaking",
  },
  {
    id: "food",
    title: "음식",
    desc: "한식, 중식, 일식, 양식",
    icon: "🍳",
    iconClass: "ciFood",
  },
  {
    id: "drink",
    title: "음료",
    desc: "커피, 티, 스무디, 에이드",
    icon: "🥤",
    iconClass: "ciDrink",
  },
];

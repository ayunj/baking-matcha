# Changelog — 004_recipe_app_prototype_ui

## Added

- `src/types/section.ts` — 섹션 설정·이모지·홈 카테고리
- `src/components/auth/AuthScreen.tsx` — 로그인·회원가입
- `src/components/home/HomeScreen.tsx` — 3카테고리 홈
- `src/components/layout/SectionTabbar.tsx` — 섹션 탭바·뒤로가기

## Changed

- `src/context/AppContext.tsx` — 화면·사용자·섹션별 데이터·auth API
- `src/data/mock-data.ts` — baking/food/drink mock·초기 사용자
- `src/components/BakingApp.tsx` — 3단 화면 라우팅
- `src/components/dashboard/DashboardPage.tsx`, `RecipesPage.tsx`, `RecipeFormModal.tsx`, `RecipeDetailModal.tsx`, `PantryPage.tsx`
- `src/styles/app.module.css`, `src/app/globals.css`, `src/app/layout.tsx` (메타·테마)
- `src/components/icons/IconSprite.tsx` — `ic-al`, `ic-check`, `ic-x2`

## Notes

- 테스트: `admin` / `1234` 로그인 → 홈 → 베이킹/음식/음료 각 탭·CRUD 확인

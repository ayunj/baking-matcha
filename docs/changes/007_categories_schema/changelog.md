# 변경사항

## 요약

schema_2 기반 `categories` 테이블 도입, 레시피 `category_id` FK, 「기타」 직접 입력 커스텀 카테고리 저장.

## 변경 파일

| 경로 | 내용 |
|------|------|
| `supabase/migrations/20250529000000_initial.sql` | schema_2 전체 |
| `supabase/migrations/20250529200000_categories_schema.sql` | v1→v2 업그레이드 |
| `src/lib/supabase/repositories/categories-repository.ts` | resolveCategoryId |
| `src/lib/supabase/repositories/recipes-repository.ts` | category_id + join |
| `src/lib/supabase/mappers.ts`, `db-types.ts` | 조인 매핑 |
| `src/types/recipe.ts` | `categoryId?` |

## Supabase 적용

1. 이미 **구 스키마**(`recipes.category`)면: `20250529200000_categories_schema.sql` 실행
2. **처음**이면: `20250529000000_initial.sql` 만 실행

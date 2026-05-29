# 분석

## 변경 요약

| Before | After |
|--------|-------|
| `recipes.category` VARCHAR | `recipes.category_id` → `categories` |
| 기타 입력값이 문자열만 저장 | 유저 커스텀 `categories` 행 생성 |

## 앱

- `resolveCategoryId()` — 기본 매칭 후 커스텀 find-or-create
- 조회 시 `categories(name)` 조인 → `Recipe.cat` 표시

## 마이그레이션

- 신규: `20250529000000_initial.sql` (schema_2)
- 기존 `category` 컬럼 DB: `20250529200000_categories_schema.sql`

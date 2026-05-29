# 변경사항

## 요약

Supabase CRUD 연동: 로그인·회원가입, 섹션별 레시피/재료 창고 조회 및 저장·수정·삭제.

## 변경 파일

| 경로 | 내용 |
|------|------|
| `src/lib/supabase/repositories/*.ts` | users, recipes, pantry repository |
| `src/lib/supabase/mappers.ts`, `db-types.ts`, `session.ts`, `load-section-data.ts` | 매핑·세션·일괄 로드 |
| `src/context/AppContext.tsx` | DB/mock 분기, async CRUD |
| `src/types/recipe.ts`, `pantry.ts` | `id: string` |
| `src/components/**` | string id, async 저장/삭제/로그인 |
| `package.json` | `bcryptjs` |

## 사용 방법

1. `20250529000000_initial.sql` Supabase에 실행
2. `.env.local` 설정
3. 회원가입 후 로그인 → 섹션에서 CRUD

## 동작 차이

- Before: mock 메모리만
- After: DB 준비 시 Supabase 영속화 + 세션 복원

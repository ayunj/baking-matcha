# 분석

## 구조

- `src/lib/supabase/repositories/*` — users, recipes(+ingredients/steps), pantry CRUD
- `src/lib/supabase/mappers.ts` — DB row ↔ `Recipe` / `PantryItem`
- `AppContext` — `tablesReady` 시 repository 호출, 아니면 mock `useState`
- `sessionStorage` — DB 로그인 세션 복원

## ID

- DB UUID → 앱 `Recipe.id` / `PantryItem.id` 를 `string` 으로 통일

## 인증

- `users` 테이블 + `bcryptjs` (클라이언트 해시/검증)
- 운영 전 서버 API 또는 Supabase Auth 전환 권장

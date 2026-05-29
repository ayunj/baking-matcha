# 스펙

## 목표

`prototype/schema.sql`에 정의된 PostgreSQL 스키마를 Supabase에 적용할 수 있도록 마이그레이션 SQL을 추가한다.

## 시나리오

1. **신규 Supabase 프로젝트**  
   `20250529000000_initial.sql` 실행 → `users`, `recipes`, `recipe_ingredients`, `recipe_steps`, `pantry` 생성, RLS(개발용 anon 허용).

2. **예전 JSONB initial 을 이미 실행한 DB**  
   `20250529100000_upgrade_legacy_jsonb_schema.sql` 실행 → `pantry_items`·구 `recipes` 제거 후 prototype 테이블 생성.

3. **앱 연결 확인**  
   `.env.local` 설정 후 `recipes` head select 성공 → DB 상태 **연결됨**.

## 범위 밖

- `AppContext` Supabase CRUD 연동 (별도 작업)
- bcrypt 회원가입 API
- `auth.users` 와 `public.users` 통합

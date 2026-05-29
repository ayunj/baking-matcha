# 분석

## 기존 상태

- `20250529000000_initial.sql`: `recipes`(jsonb), `pantry_items`(단순) — prototype 과 불일치
- 앱은 mock-data, `check-connection` 은 `recipes` 존재만 검사

## 설계

- prototype 정규화 스키마(유저·재료·단계 분리)를 `public` 스키마에 반영
- Supabase 관례: `TIMESTAMPTZ`, RLS, `gen_random_uuid()`
- `public.users` 는 앱 자체 username/password 용 (`auth.users` 와 분리)
- legacy 업그레이드는 `pantry_items` 또는 `recipes.cat` 컬럼 존재 시에만 DROP

## 대안

- 단일 마이그레이션만 유지: 이미 구 initial 을 쓴 DB는 수동 DROP 필요 → 업그레이드 파일로 분리함

## 체크리스트

- [x] DB 마이그레이션 (`supabase/migrations/`)
- [ ] 환경 변수 변경 없음
- [ ] 운영 RLS — 추후 `user_id` 기반으로 교체 필요

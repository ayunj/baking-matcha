# 변경사항

## 요약

`prototype/schema.sql` 기반 Supabase 마이그레이션을 추가하고, 예전 JSONB 스키마에서 올리는 업그레이드 스크립트를 넣었다.

## 변경 파일

| 경로 | 내용 |
|------|------|
| `supabase/migrations/20250529000000_initial.sql` | prototype 전체 스키마 + RLS |
| `supabase/migrations/20250529100000_upgrade_legacy_jsonb_schema.sql` | legacy → prototype |
| `prototype/schema.sql` | TIMESTAMPTZ·마이그레이션 경로 주석 |
| `docs/supabase.md` | 스키마·적용 방법 갱신 |
| `docs/changes/005_prototype_db_schema/*` | 본 변경 문서 |

## 적용 방법

Supabase SQL Editor에서 **신규**면 `20250529000000_initial.sql` 만 실행. 예전 `pantry_items` 가 있으면 `20250529100000_upgrade_legacy_jsonb_schema.sql` 실행.

## 동작 차이

- Before: jsonb 단일 `recipes`, `pantry_items`
- After: `users`, 정규화 `recipe_*`, 섹션별 `pantry`

## 주의

- RLS는 개발용 전체 허용 — 공개 전 강화 필요
- 마이그레이션은 Supabase 대시보드에서 **직접 Run** 필요 (로컬 `.env`만으로 자동 적용되지 않음)

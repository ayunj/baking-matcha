# 변경사항

## 요약

Supabase 클라이언트·연결 검사·상태 UI를 추가하고, Vercel/Supabase 설정 가이드 및 DB 스키마 마이그레이션 파일을 문서화했다. 앱 데이터는 mock 유지.

## 변경 파일

| 경로 | 내용 |
|------|------|
| `package.json` | `@supabase/supabase-js` 의존성 |
| `.env.example` | Supabase env 예시 |
| `src/lib/supabase/client.ts` | 싱글톤 클라이언트, `isSupabaseConfigured` |
| `src/lib/supabase/check-connection.ts` | Auth + 테이블 프로브 |
| `src/context/SupabaseContext.tsx` | 연결 상태 context |
| `src/app/layout.tsx` | `SupabaseProvider` 래핑 |
| `src/components/layout/DbConnectionStatus.tsx` | 사이드바 상태 뱃지 |
| `src/components/layout/Sidebar.tsx` | 상태 컴포넌트 배치 |
| `src/styles/app.module.css` | sidebar·dbStatus 스타일 |
| `supabase/migrations/20250529000000_initial.sql` | recipes, pantry_items + RLS |
| `docs/README.md` | 프로젝트 문서 색인 |
| `docs/architecture.md` | 아키텍처 |
| `docs/project-structure.md` | 폴더 구조 |
| `docs/supabase.md` | Supabase 설정·스키마 |
| `docs/vercel.md` | Vercel env |
| `docs/development.md` | 로컬·트러블슈팅 |

## 동작 차이

- Before: mock만, DB·배포 문서 없음
- After: env 설정 시 Supabase 연결 확인 및 사이드바 표시; mock CRUD는 그대로

## 주의

1. Supabase **SQL Editor**에서 마이그레이션 실행 전까지 「테이블 준비 필요」 표시.
2. Vercel env 추가·수정 후 **Redeploy** 필요.
3. RLS 정책이 anon 전체 허용 — 공개 서비스 전 강화 필요 (`docs/supabase.md`).
4. Secret key (`sb_secret_...`)는 Vercel·클라이언트에 넣지 말 것.

## 부속

- SQL: [`supabase/migrations/20250529000000_initial.sql`](../../../supabase/migrations/20250529000000_initial.sql)

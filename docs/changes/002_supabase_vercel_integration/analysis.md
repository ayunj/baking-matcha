# 분석

## 기존 상태

- Next.js 15 클라이언트 앱만 존재. 레시피·재료는 `AppContext` + `mock-data.ts` in-memory.
- Supabase·Vercel 연동 코드 없음.

## 설계 선택

- **BaaS 패턴**: 별도 백엔드 서버 없이 브라우저에서 `@supabase/supabase-js`로 API 호출.
- **연결 확인**: `auth.getSession()` 후 `recipes` 테이블 head 요청으로 테이블 유무 구분 (`check-connection.ts`).
- **Provider 계층**: `SupabaseProvider` → `AppProvider` 순 (`layout.tsx`). `useSupabase()`로 클라이언트·상태 공유.
- **Publishable key만** `NEXT_PUBLIC_*` — Secret key는 사용하지 않음.
- **마이그레이션 파일**을 repo에 두고, Supabase SQL Editor에서 수동 실행 (Git 연동 없이 프로젝트 생성한 경우 대비).

## 대안

- Vercel Postgres: Supabase와 중복 스택이라 채택하지 않음.
- 연결 확인만 env 존재 여부: 실제 키 오류를 못 잡아 API 프로브 방식 채택.

## 프로젝트 맥락

- [x] DB: `supabase/migrations/20250529000000_initial.sql` (수동 실행)
- [x] 환경 변수: `.env.example`, Vercel Environment Variables
- [ ] AppContext ↔ DB CRUD: 미구현 (`docs/supabase.md` 「다음 단계」)
- 레이어: `src/lib/supabase/*` → `SupabaseContext` → UI `DbConnectionStatus`
- 배포: Vercel (Next.js), DB 호스팅 Supabase

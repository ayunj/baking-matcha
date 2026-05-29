# 아키텍처

## 개요

베이킹 레시피·재료 창고를 관리하는 **클라이언트 중심** 웹 앱입니다. 별도 백엔드 서버(VPS, Express 등)는 두지 않습니다.

```
┌─────────────────────────────────────────────────────────┐
│  사용자 브라우저                                         │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel — Next.js 15 (App Router)                       │
│  · 정적/클라이언트 UI (React 19)                          │
│  · 환경 변수: NEXT_PUBLIC_SUPABASE_*                     │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS (Publishable key)
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase                                               │
│  · PostgreSQL (recipes, pantry_items)                   │
│  · Auth API (연결 확인용)                                │
│  · Row Level Security (개발용 완화 정책)                  │
└─────────────────────────────────────────────────────────┘
```

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15, React 19, TypeScript |
| 스타일 | CSS Modules (`src/styles/app.module.css`) |
| DB·BaaS | Supabase (`@supabase/supabase-js`) |
| 호스팅 | Vercel |
| 폰트 | Noto Sans KR, Lora (Google Fonts) |

## 앱 레이어

1. **페이지** — `src/app/page.tsx` → `BakingApp`
2. **상태** — `AppContext`: 탭, 레시피·재료 목록, CRUD (현재 in-memory)
3. **Supabase** — `SupabaseContext`: 클라이언트, 연결 상태, `tablesReady`
4. **UI** — 대시보드 / 레시피 / 재료 창고 + 모달 폼

## 데이터 소스 (현재)

| 조건 | 데이터 |
|------|--------|
| env 미설정 또는 연결 실패 | `src/data/mock-data.ts` |
| Supabase 연결 OK, 테이블 없음 | mock (상태: 「테이블 준비 필요」) |
| Supabase 연결 OK, 테이블 있음 | **아직 mock** — CRUD 연동 전 |

연결 확인만 Supabase를 사용하고, 실제 목록·저장은 `AppContext`의 React state입니다.

## Provider 순서

`src/app/layout.tsx`:

```
SupabaseProvider
  └── AppProvider
        └── children (BakingApp)
```

`AppProvider` 안에서 `useSupabase()`를 쓰려면 이 순서를 유지해야 합니다.

## 보안 참고

- Vercel·클라이언트에는 **Publishable key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)만 둡니다.
- **Secret key** (`sb_secret_...`)는 서버 전용이며, 이 프로젝트에는 넣지 않습니다.
- RLS는 마이그레이션에서 `using (true)`로 열려 있어 **누구나 anon으로 읽기/쓰기 가능**합니다. 공개 배포 전 Auth·정책 강화가 필요합니다.

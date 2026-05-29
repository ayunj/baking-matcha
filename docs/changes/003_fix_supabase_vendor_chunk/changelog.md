# Changelog — 003_fix_supabase_vendor_chunk

## Added

- `src/lib/supabase/env.ts` — `isSupabaseConfigured()` (Supabase 패키지 미import)

## Changed

- `src/lib/supabase/client.ts` — `"use client"`, 동적 import, 브라우저 전용 초기화
- `src/context/SupabaseContext.tsx` — `useEffect` 기반 비동기 클라이언트·연결 검사

## Ops (로컬)

- 손상 캐시 시: `.next` 폴더 삭제 후 `npm run dev` 또는 `npm run build`

## Verified

- `npm run build` 성공 (Next.js 15.5.18)

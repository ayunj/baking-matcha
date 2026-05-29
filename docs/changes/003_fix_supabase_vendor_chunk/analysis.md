# 분석

## 원인

- `.next/server/app/page.js`가 `vendor-chunks/@supabase`, `tslib`, `iceberg-js` 청크를 참조했으나 `.next/server/vendor-chunks/`에는 `next.js`, `@swc.js`만 존재 (불완전·손상된 dev 빌드 캐시).
- `client.ts`가 `@supabase/supabase-js`를 **정적 import**하고, `SupabaseProvider`의 `useMemo`가 SSR 단계에서도 클라이언트 생성 경로를 타며 서버 번들에 Supabase vendor 청크 분할이 걸림.

## 대응

1. **즉시**: `.next` 삭제 후 `npm run build`로 캐시 재생성.
2. **구조**: `env.ts`로 env 검사만 분리, `client.ts`는 `"use client"` + `dynamic import()` + `typeof window` 가드, `SupabaseProvider`는 `useEffect`에서만 클라이언트·연결 검사 수행.

## 영향

- Supabase JS는 클라이언트 비동기 청크로 로드되어 SSR vendor 청크 의존이 줄어듦.
- `getSupabaseClient()` 시그니처가 `Promise<SupabaseClient | null>`로 변경 (호출부는 `SupabaseContext`만).

# 스펙

## 목표

로컬 `next dev` / `next start` 시 `Cannot find module './vendor-chunks/@supabase.js'` 런타임 오류를 제거한다.

## 시나리오 (정상)

1. **조건**: `.next` 삭제 후 `npm run dev` 또는 `npm run build && npm run start`
   **행동**: 홈(`/`) 접속
   **기대 결과**: 500 없이 앱 UI가 렌더링된다.

2. **조건**: `NEXT_PUBLIC_SUPABASE_*` env 미설정
   **행동**: 앱 로드
   **기대 결과**: DB 상태가 `misconfigured`로 표시되고 크래시 없음.

## 예외

- **조건**: `.next`만 삭제하지 않고 이전 깨진 캐시로 `next start`
  **기대 결과**: 동일 오류가 남을 수 있음 → `.next` 삭제 후 재빌드 필요.

## 범위 밖

- Supabase CRUD를 mock에서 DB로 전환하는 작업 (`002_` 후속).

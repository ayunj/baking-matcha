# 스펙

## 목표

융융의 베이킹노트 앱이 **Vercel**에 배포되고, **Supabase**와 URL·Publishable key로 연동되며, 연결 상태를 UI에서 확인할 수 있게 한다. 데이터 CRUD는 당분간 mock을 유지하고, DB 테이블은 마이그레이션 SQL로 준비만 한다.

## 시나리오 (정상)

1. **조건**: Vercel에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 설정되어 있다.
   **행동**: 배포된 앱을 연다.
   **기대 결과**: 사이드바에 DB 연결 상태가 표시된다 (연결됨 / 테이블 준비 필요 / 미설정 / 실패).

2. **조건**: 로컬 `.env.local`에 동일한 변수가 있다.
   **행동**: `npm run dev` 후 앱을 연다.
   **기대 결과**: Vercel과 동일하게 Supabase 연결 검사가 동작한다.

3. **조건**: Supabase SQL Editor에서 `supabase/migrations/20250529000000_initial.sql`을 실행했다.
   **행동**: 앱을 새로고침한다.
   **기대 결과**: 상태가 「DB 사용 중」(테이블 프로브 성공)으로 바뀐다. 레시피·재료 목록은 여전히 mock(또는 빈 DB)이다.

## 예외

- **조건**: env 변수가 없다.
  **기대 결과**: 「DB 미설정 (mock)」— 앱은 `mock-data`로 동작한다.

- **조건**: URL·키가 잘못되었다.
  **기대 결과**: 「DB 연결 실패」, hover 시 오류 메시지.

## 범위 밖

- `AppContext`의 Supabase CRUD (repository·DB 저장)
- Supabase Auth·RLS 강화
- Secret key를 Vercel/클라이언트에 노출

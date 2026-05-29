# 로컬 개발

## 요구 사항

- Node.js 18+
- npm

## 시작

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
# .env.local에 Supabase URL·Publishable key 입력
npm run dev
```

http://localhost:3000

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |

## 환경 변수 없을 때

- `isSupabaseConfigured()` → `false`
- 사이드바: **DB 미설정 (mock)**
- 레시피·재료는 `mock-data.ts`로 동작 (정상)

## Supabase 연결만 확인할 때

1. `.env.local`에 올바른 URL·키
2. `npm run dev` → 사이드바 **DB 연결됨 · 테이블 준비 필요** (마이그레이션 전)
3. SQL 실행 후 새로고침 → **DB 사용 중** (테이블 있을 때)

## 자주 하는 문제

### 사이드바 「DB 연결 실패」

- URL·키 오타, 앞뒤 공백
- 다른 Supabase 프로젝트 키 사용
- Supabase 프로젝트 일시 중지

### Vercel에서는 되는데 로컬만 안 됨

- `.env.local` 없음 또는 dev 서버 재시작 안 함
- Vercel env는 로컬에 자동 반영되지 않음 → `vercel env pull` 또는 수동 복사

### 데이터가 mock과 같고 DB에 안 남음

- **예상 동작:** `AppContext`가 아직 Supabase CRUD 미연동
- 테이블만 만들었다고 앱 데이터가 DB로 가지 않음 → [supabase.md](./supabase.md) 「다음 단계」

### 빌드는 되는데 런타임 에러

- `NEXT_PUBLIC_` 접두사 누락
- Vercel에 env 추가 후 Redeploy 안 함

## 프로토타입

`prototype/baking_matcha_v11.html` — 초기 UI 참고용. 런타임에는 사용하지 않습니다.

## 관련 문서

- [architecture.md](./architecture.md)
- [supabase.md](./supabase.md)
- [vercel.md](./vercel.md)

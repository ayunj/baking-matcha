# Vercel 배포

## 역할 분리

| 서비스 | 역할 |
|--------|------|
| **Vercel** | Next.js 빌드·호스팅 (`baking-matcha.vercel.app` 등) |
| **Supabase** | PostgreSQL·API (별도 서버 구매 불필요) |

Vercel에 PostgreSQL connection string을 넣는 방식은 이 스택에서 사용하지 않습니다.

## 환경 변수 위치

**프로젝트 → Settings → Environment Variables**

- **Environments** 메뉴(Production/Preview 브랜치 매핑)와 혼동하지 마세요.
- 변수 이름은 **Project** 탭에서 프로젝트별로 관리합니다.

## 등록할 변수

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Publishable key |

권장: **Production** + **Preview** 모두 체크.

**Sensitive** 표시는 값 마스킹용이며, 설정 방식은 동일합니다.

## 프로젝트별 분리

- 환경 변수는 **Vercel 프로젝트마다 독립**입니다.
- `baking-matcha` Vercel 프로젝트 ↔ 베이킹용 Supabase 프로젝트가 1:1이어야 합니다.
- 다른 앱의 Supabase 키를 넣지 않습니다.

**Shared** 변수 / **Link Shared Variable**은 여러 Vercel 프로젝트에 같은 값이 붙을 수 있어, 이 앱만 쓸 때는 **Project** 탭만 사용하는 것이 안전합니다.

## 배포 후

1. 변수 추가·수정 후 **Deployments → Redeploy** (이미 배포된 경우 필수)
2. 배포 URL에서 사이드바 DB 상태 확인
3. 테이블 미생성 시 「테이블 준비 필요」 — [supabase.md](./supabase.md) 마이그레이션 실행

## 로컬과 동기화

```bash
npx vercel env pull
```

프로젝트 루트에 `.env.local`이 생성·갱신됩니다 (Vercel CLI 로그인 필요).

## Git 연동

- 저장소 push → Vercel 자동 빌드
- `main` → Production (`baking-matcha.vercel.app`)
- 다른 브랜치 → Preview URL

Supabase ↔ GitHub Integration은 DB 마이그레이션 자동화용 선택 사항이며, 앱 env 설정과는 별개입니다.

## 체크리스트

- [ ] `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` 등록
- [ ] 베이킹용 Supabase 프로젝트 값인지 확인
- [ ] Redeploy 완료
- [ ] Supabase SQL로 테이블 생성 (DB 사용 시)
- [ ] Secret key는 Vercel에 등록하지 않음

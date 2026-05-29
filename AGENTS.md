# baking-matcha — AI·개발자 가이드

융융의 베이킹노트 (Next.js 15 + Supabase + Vercel).

## 빠른 링크

| 문서 | 용도 |
|------|------|
| [docs/README.md](docs/README.md) | 아키텍처·Supabase·Vercel·로컬 개발 |
| [docs/PORTABLE_AI_CHANGE_WORKFLOW.md](docs/PORTABLE_AI_CHANGE_WORKFLOW.md) | 변경 작업 워크플로 (이식용 전체) |
| [docs/changes/README.md](docs/changes/README.md) | 건당 변경 이력 색인 |

## 스택·경로

- 앱 소스: `src/**`
- 스타일: `src/styles/app.module.css`
- DB 마이그레이션: `supabase/migrations/`
- env 예시: `.env.example` (실제 값은 `.env.local`, Vercel env)
- Git 기준 브랜치: `main`
- 기능 브랜치: `feature/{english-summary-with-hyphens}`

## 변경 작업 문서화 (`docs/changes`)

소스·설정을 **실제로 바꾼** 기능/버그 작업이 끝나면 건당 폴더에 문서 3개를 남긴다.

| 항목 | 규칙 |
|------|------|
| 경로 | `docs/changes/NNN_english_snake_summary/` |
| 번호 | `^\d{3}_` 폴더만 세어 최댓값 + 1 |
| 필수 | `spec.md`, `analysis.md`, `changelog.md` |
| 샘플 | `docs/changes/001_add-change-docs/` |
| 상세 | `docs/PORTABLE_AI_CHANGE_WORKFLOW.md` |

### 작업 순서

1. 이 파일(`AGENTS.md`) · [PORTABLE_AI_CHANGE_WORKFLOW.md](docs/PORTABLE_AI_CHANGE_WORKFLOW.md) 확인
2. `NNN_` 확정 → (신규 기능·버그 시) `main` pull → `feature/...` 브랜치 생성
3. `spec.md` 초안 → 구현 → `analysis.md`, `changelog.md` (spec과 모순 없게)
4. (요청 시) `work_summary.md` · (요청 시만) git commit / push

### 생략

- 질문·설명만, 코드·설정 미변경
- `.cursor/rules/**` 또는 `docs/changes/README.md` 등 **메타만** 수정 → `NNN_` 폴더 생성 안 함

### 커밋

- 사용자가 요청할 때만 커밋·push
- `.env*.local`, `node_modules`, `.next` 등은 커밋 제외

## Supabase·데이터 (현재)

- 연결: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- UI 상태: `useSupabase()` — `DbConnectionStatus`
- 앱 CRUD: `AppContext` + `mock-data` (DB CRUD 미연동 시 [docs/supabase.md](docs/supabase.md) 참고)

## 응답 언어

사용자와 한국어로 소통한다 (사용자 규칙).


# AGENT.md

이 파일은 AI 코딩 에이전트가 본 프로젝트를 이해하고 작업할 때 참고하는 문서입니다.

---

## 프로젝트 개요

**나의 레시피 노트** — 베이킹 / 음식 / 음료 레시피와 재료 창고를 섹션별로 독립 관리하는 개인용 웹 앱.

현재 상태: **HTML 프로토타입 완성** → 백엔드 + DB 연동 개발 단계

---

## 핵심 설계 결정

### 섹션 구조
- 3개 섹션: `baking` / `food` / `drink`
- 섹션별로 레시피, 재료 창고, 카테고리가 **완전히 독립** 운영
- DB에서 `section_type` enum으로 구분

### 카테고리
- 기본 카테고리 (`is_default = true`, `user_id = NULL`) 와 유저 커스텀 카테고리 (`is_default = false`, `user_id = 해당 유저`) 를 `categories` 테이블 하나로 관리
- 앱에서 "기타" 선택 후 직접 입력 시 → 해당 유저의 커스텀 카테고리로 INSERT
- 카테고리 목록 조회: `is_default = true OR user_id = 현재유저` 조건

### 재료 입력 방식
- `"박력분 200g"` 형태의 자유 텍스트로 저장 (`recipe_ingredients.content`)
- 배수 계산은 **앱단 정규식**으로 처리 — DB 파싱 불필요
- 지원 포맷: 정수(`200`), 소수(`1.5`), 분수(`1/2`)

### 오븐 설정
- `oven_preheat`, `oven_temp`, `oven_time` 컬럼은 `baking` 섹션에서만 사용
- 음식 / 음료 섹션에서는 `NULL` 저장, UI에서도 미표시

### 인증
- 현재 프로토타입: 하드코딩 계정 배열로 검증
- 실제 구현: 비밀번호 **bcrypt 해시** 저장 필수 (cost factor 12 이상 권장)
- 추후 카카오 / 네이버 OAuth 연동 예정 → `oauth_accounts` 테이블 별도 추가, 기존 테이블 변경 없음

---

## 테이블 구조 요약

| 테이블 | 역할 | 주요 FK |
|--------|------|---------|
| `users` | 계정 | - |
| `categories` | 레시피 카테고리 (기본 + 커스텀) | `user_id → users` |
| `recipes` | 레시피 기본 정보 | `user_id → users`, `category_id → categories` |
| `recipe_ingredients` | 레시피 재료 목록 | `recipe_id → recipes` |
| `recipe_steps` | 레시피 단계 | `recipe_id → recipes` |
| `pantry` | 재료 창고 | `user_id → users` |

전체 DDL: `schema.sql`

---

## 자주 쓰는 쿼리 패턴

```sql
-- 유저의 섹션별 카테고리 목록 (기본 + 커스텀 합산)
SELECT * FROM categories
WHERE section = :section
  AND (is_default = true OR user_id = :userId)
ORDER BY is_default DESC, sort_order;

-- 레시피 목록 (카테고리명 포함)
SELECT r.*, c.name AS category_name
FROM recipes r
JOIN categories c ON r.category_id = c.id
WHERE r.user_id = :userId AND r.section = :section
ORDER BY r.created_at DESC;

-- 레시피 상세 (재료 + 단계 포함)
SELECT * FROM recipe_ingredients
WHERE recipe_id = :recipeId ORDER BY sort_order;

SELECT * FROM recipe_steps
WHERE recipe_id = :recipeId ORDER BY sort_order;

-- 재고 부족 카운트 (대시보드 통계)
SELECT COUNT(*) FROM pantry
WHERE user_id = :userId AND section = :section AND is_low = true;
```

---

## 앱 상태 구조 (프로토타입 JS)

```js
// 전역 상태
let curUser    // 로그인 유저 객체 { id, name }
let curSection // 현재 섹션 'baking' | 'food' | 'drink'
let curPage    // 현재 탭 'dash' | 'recipes' | 'pantry'
let catFilter  // 레시피 카테고리 필터 ('전체' 또는 카테고리명)

// 데이터 구조
D = {
  baking: { recipes: [...], pantry: [...] },
  food:   { recipes: [...], pantry: [...] },
  drink:  { recipes: [...], pantry: [...] },
}

// 레시피 객체 구조
{
  id, emoji, name, cat, serving,
  preheat, bakeTemp, bakeTime,  // 베이킹 전용
  ingredients: ['박력분 200g', ...],
  steps: [{ text: '...', memo: '...' }, ...],
  note, createdAt
}
```

---

## 화면 전환 흐름

```
sc-auth (로그인/회원가입)
    ↓ tryLogin() / trySignup()
sc-home (섹션 선택)
    ↓ goSection(sec)
sc-section
  ├── spg('dash')    → rDash()
  ├── spg('recipes') → rR()
  └── spg('pantry')  → rI()
```

모달: `rmModal` (레시피 작성/수정), `dtModal` (레시피 상세), `imModal` (재료 추가/수정)

---

## 반응형 브레이크포인트

| 브레이크포인트 | 주요 변화 |
|--------------|---------|
| `1200px` | max-width 기준, 콘텐츠 중앙 정렬 |
| `900px` | 홈 카테고리 카드 3열 → 2열 |
| `600px` | 카테고리 1열, 레시피 카드 2열, 모달 패딩 축소 |
| `480px` | 탭 버튼 패딩 축소, 모달 폼 세로 정렬 |
| `400px` | 패딩 최소화 |

---

## 작업 시 주의사항

- 재료 배수 계산 로직은 `parseIng()`, `scaleNum()`, `scaleText()` 함수로 분리되어 있음 — 수정 시 세 함수 모두 확인
- 카테고리 옵션은 섹션마다 다름 — `SECTIONS` 객체의 `cats` 배열 참고
- 오븐 설정 UI는 `SECTIONS[sec].showOven` 값으로 on/off 제어
- 모달 열기/닫기는 `.ovl` 클래스에 `.open` 토글로 처리 — `position: fixed` 미사용 (iframe 환경 제약)
- `updated_at` 자동 갱신은 DB 트리거로 처리 (`trg_users_updated_at`, `trg_recipes_updated_at`)

---

## TODO (다음 작업)

- [ ] 백엔드 API 서버 구축 (Node.js / Express 또는 FastAPI)
- [ ] PostgreSQL 연동 (`schema.sql` 기반)
- [ ] JWT 기반 세션 관리
- [ ] 카카오 / 네이버 OAuth 연동
- [ ] 레시피 이미지 업로드
- [ ] 레시피 공유 기능
- [ ] 재료 창고 ↔ 레시피 재료 자동 매칭

# 변경 이력 (`docs/changes`)

기능·버그·설정 변경은 **건당 한 폴더** (`NNN_english_snake_summary`).

| 문서 | 설명 |
|------|------|
| [AGENTS.md](../../AGENTS.md) | AI·개발자 진입 (작업 순서·문서화 규칙) |
| [PORTABLE_AI_CHANGE_WORKFLOW.md](../PORTABLE_AI_CHANGE_WORKFLOW.md) | 이식용 전체 워크플로 |
| 샘플 | [001_add-change-docs/](001_add-change-docs/) |

## 필수 파일 (매 변경)

- `spec.md` — 무엇을, 왜, 시나리오
- `analysis.md` — 기존 상태, 설계 선택
- `changelog.md` — 변경 파일, Before/After, 배포 주의

## 번호 규칙

`docs/changes/` 아래 `^\d{3}_` 로 시작하는 폴더만 세어 **최댓값 + 1** (없으면 `001`).

`README.md`, `archive/` 등은 번호에 포함하지 않습니다.

## baking-matcha 프로젝트 설정

| 항목 | 값 |
|------|-----|
| 변경 이력 루트 | `docs/changes/` |
| Git 기준 브랜치 | `main` |
| 기능 브랜치 | `feature/{summary-with-hyphens}` |
| 앱 소스 | `src/**` |
| DB 마이그레이션 | `supabase/migrations/` |
| 환경 변수 예시 | `.env.example` |

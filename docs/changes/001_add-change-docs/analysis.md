# 분석

## 기존 상태

- `docs/`에 아키텍처·Supabase·Vercel 가이드만 있고, **건당 변경 이력** 폴더는 없었다.
- `docs/PORTABLE_AI_CHANGE_WORKFLOW.md`는 이식용 템플릿으로만 존재했다.

## 설계 선택

- 워크플로 템플릿을 그대로 두고, **baking-matcha 전용**으로 `docs/changes/README.md`, `001_` 샘플, 루트 `AGENTS.md`, `.cursor/rules/change-documentation.mdc`를 추가했다.
- Cursor `alwaysApply` 규칙으로, 이후 기능 작업 시 에이전트가 매번 `NNN_` 폴더를 만들도록 했다.
- 번호는 `^\d{3}_` 폴더만 집계해 템플릿과 동일하게 유지했다.

## 대안

- 루트 `CHANGELOG.md` 단일 파일: 이력이 길어지면 diff 추적이 어려워 **건당 폴더** 방식을 채택했다.

## 프로젝트 맥락

- [ ] DB 마이그레이션: 해당 없음 (문서·규칙만)
- [x] 에이전트 규칙: `.cursor/rules/change-documentation.mdc`
- [x] 진입 문서: `AGENTS.md`
- Git 기준 브랜치: `main`

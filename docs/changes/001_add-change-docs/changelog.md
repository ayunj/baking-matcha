# 변경사항

## 요약

변경 작업 문서화 워크플로(`docs/changes/NNN_*`)를 baking-matcha에 도입했다. 샘플 `001_`, 색인 README, `AGENTS.md`, Cursor 규칙을 추가했다.

## 변경 파일

| 경로 | 내용 |
|------|------|
| `docs/changes/README.md` | 변경 이력 색인·프로젝트 설정 |
| `docs/changes/001_add-change-docs/spec.md` | 본 규칙 도입 스펙 |
| `docs/changes/001_add-change-docs/analysis.md` | 분석 |
| `docs/changes/001_add-change-docs/changelog.md` | 본 파일 |
| `AGENTS.md` | AI 진입·문서화 절 |
| `.cursor/rules/change-documentation.mdc` | Cursor alwaysApply 규칙 |
| `docs/README.md` | changes·워크플로 링크 추가 |

## 동작 차이

- Before: 코드 변경 시 공통 이력 폴더 없음
- After: 소스 변경 작업 종료 시 `docs/changes/NNN_*` 필수 작성 (에이전트 규칙)

## 주의

- 기능 브랜치 생성은 워크플로 §4에 따르며, **push/커밋은 사용자 요청 시만** 수행한다.
- `docs/PORTABLE_AI_CHANGE_WORKFLOW.md`는 수정하지 않았다 (이식용 마스터 템플릿).

# baking-matcha 문서

융융의 베이킹노트 — Next.js 앱의 인프라·Supabase 연동·배포 가이드입니다.

## 목차

| 문서 | 내용 |
|------|------|
| [architecture.md](./architecture.md) | 전체 구조, 스택, 데이터 흐름 |
| [project-structure.md](./project-structure.md) | 폴더·주요 파일 설명 |
| [supabase.md](./supabase.md) | Supabase 설정, 테이블, 연동 코드 |
| [vercel.md](./vercel.md) | Vercel 배포·환경 변수 |
| [development.md](./development.md) | 로컬 실행·문제 해결 |
| [changes/README.md](./changes/README.md) | **건당 변경 이력** (`NNN_*`) |
| [PORTABLE_AI_CHANGE_WORKFLOW.md](./PORTABLE_AI_CHANGE_WORKFLOW.md) | AI 변경 작업 워크플로 (이식용) |

루트 [AGENTS.md](../AGENTS.md) — AI·개발자 진입 문서.

## 현재 구현 상태 (요약)

| 영역 | 상태 |
|------|------|
| UI (대시보드, 레시피, 재료 창고) | ✅ mock 데이터로 동작 |
| Vercel 배포 | ✅ (Git 연동) |
| Supabase 클라이언트·연결 확인 | ✅ |
| 사이드바 DB 상태 표시 | ✅ |
| DB 테이블 SQL (마이그레이션 파일) | ✅ (`supabase/migrations/`) |
| AppContext ↔ Supabase CRUD | ⏳ 미연동 (아직 `mock-data` 사용) |

테이블 생성 후 CRUD를 붙이려면 [supabase.md](./supabase.md)의 「다음 단계」를 참고하세요.

## 변경 이력

| 번호 | 요약 |
|------|------|
| [001_add-change-docs](./changes/001_add-change-docs/) | `docs/changes` 워크플로 도입 |
| [002_supabase_vercel_integration](./changes/002_supabase_vercel_integration/) | Supabase 연동·Vercel·docs |

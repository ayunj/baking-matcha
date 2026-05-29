# AI 에이전트용 변경 작업 워크플로 (이식용 템플릿)

> **용도:** 기능·버그·설정 변경을 할 때마다 `docs/changes/001_…`, `002_…` 폴더에 스펙·분석·변경 이력을 남기고, AI(Cursor 등)가 매번 같은 형식으로 작업하게 하는 규칙입니다.  
> **다른 프로젝트에 적용:** 이 파일 전체 + 아래 「Cursor 규칙」「AGENTS.md 절」+ `docs/changes/001_…` 샘플 폴더를 복사한 뒤, **프로젝트 설정** 표만 해당 저장소에 맞게 고칩니다.

---

## 1. 한 줄 요약

| 항목 | 내용 |
|------|------|
| **언제** | 소스·설정·스키마 등 **실제 코드/설정이 바뀌는** 작업이 끝날 때 |
| **어디** | `docs/changes/NNN_english_snake_summary/` (건당 1폴더) |
| **필수 3파일** | `spec.md` · `analysis.md` · `changelog.md` |
| **선택** | `work_summary.md`(사용자가 작업 정리 요청 시), `sql/`, `notes.md` 등 |
| **번호** | `docs/changes/` 아래 `^\d{3}_` 패턴 폴더만 세어 **최댓값 + 1** (없으면 `001`) |

---

## 2. 프로젝트 설정 (복사 후 반드시 수정)

다른 저장소에 붙일 때 아래만 프로젝트에 맞게 채웁니다.

| 설정 | 예시 (NIFOS) | 당신 프로젝트에 맞게 |
|------|----------------|----------------------|
| 변경 이력 루트 | `docs/changes/` | |
| 에이전트 진입 문서 | `AGENTS.md` (루트) | |
| 코딩 규칙 문서 | `docs/MODIFICATION_GUIDE.md` | 없으면 생략 또는 `CONTRIBUTING.md` |
| Git 기준 브랜치 | `dev` | `main` / `develop` 등 |
| 기능 브랜치 접두사 | `feature/` | 동일 권장 |
| 커밋 메시지 규칙 | `docs/COMMIT_CONVENTION.md` (`feat: …`) | 팀 규칙 링크 |
| 커밋에서 제외할 경로 | `.gitignore`, `.project`, `.settings/**`, `target/` | IDE·빌드 산출물 |
| JSP/프론트 수정 범위 | `views/web/eln/` 만 | 해당 모노레포 경로 |
| DB/매퍼 프로필 | `mariadb-enter`, `metamapper` / `synchmapper` | 없으면 삭제 |
| 다국어 파일 | `ko` / `en` / `ja` / `zh` 4종 | 해당 언어 목록 |

**analysis.md / changelog.md**에 자주 적을 **프로젝트 맥락 체크리스트** (해당 없으면 항목 삭제):

- [ ] DB 마이그레이션 / 수동 SQL 필요 여부  
- [ ] 환경 변수·시크릿·배포 프로필 변경  
- [ ] 배치·스케줄(cron) 추가/변경  
- [ ] 외부 API·메시지 큐 연동  
- [ ] 권한·인증·세션 저장소  
- [ ] 캐시 무효화  
- [ ] 하위 호환 / 롤백 방법  

---

## 3. 폴더·파일 규칙

### 3.1 폴더 이름

```text
docs/changes/NNN_english_snake_summary/
```

| 부분 | 규칙 |
|------|------|
| `NNN` | 3자리 (`001`, `002`, …). `docs/changes/` 아래 **`^\d{3}_`로 시작하는 폴더만** 번호에 포함 |
| `english_snake_summary` | 영문 소문자, 단어는 `_` (예: `fix_login_session_timeout`) |

**주의:** `docs/changes/README.md`, `archive/` 등 `001_` 형식이 아닌 항목은 번호 계산에 넣지 않습니다.

### 3.2 필수 파일 (매 변경)

| 파일 | 역할 |
|------|------|
| `spec.md` | **무엇을** 왜 하는지, 검증 가능한 시나리오, 예외, 범위 밖 |
| `analysis.md` | **기존 상태**, 설계 선택, 대안, 기술 맥락(레이어·DB·배치) |
| `changelog.md` | **요약**, 변경 파일 목록, 동작 차이, 배포·운영 주의 |

- **파일명은 항상 영어** (`spec.md`, `analysis.md`, `changelog.md`).
- 본문은 팀 언어(한국어 등) 사용 가능.

### 3.3 선택 파일

| 파일/폴더 | 언제 |
|-----------|------|
| `work_summary.md` | 사용자가 「작업 정리해줘」「분석·작업내역 작성해줘」 등 요청 시 |
| `sql/001_….sql`, `sql/rollback_notes.md` | DB 스크립트가 있을 때 |
| `notes.md`, `screenshots/` | 스크린샷·임시 메모 |

부속물 경로는 **`changelog.md`에 반드시 기록**합니다.

---

## 4. Git 브랜치 (기능·버그 작업 시작 시)

**새 `NNN_` 폴더와 함께** 기능·버그 수정을 **시작할 때** (코드 수정 전):

1. 기준 브랜치로 이동·최신화: `git checkout <base>` → `git pull origin <base>`
2. 브랜치 생성: `git checkout -b feature/<english_snake_summary-with-hyphens>`
   - 폴더 `006_fix_note_export` → 브랜치 `feature/fix-note-export` (`NNN_` 제외, `_` → `-`)
3. 작업·커밋은 기능 관련 파일만 (IDE·로컬 설정 제외)
4. **push**는 사용자가 요청할 때만

**브랜치 생략**

- 기존 `NNN_` 폴더에 **이어쓰기** (이미 맞는 `feature/*` 브랜치면 유지)
- 질문·리뷰만, **코드 미변경**
- Cursor 규칙·`docs/changes/README.md` 등 **메타 문서만** 수정

---

## 5. 언제 `NNN_` 폴더를 만들지

| 만들 **O** | 만들 **X** |
|------------|------------|
| `src/**`, 설정, 스키마, 인프라 코드 등 **앱·운영 설정** 변경 | 질문·설명만, 코드·설정 미변경 |
| 버그 수정, 기능 추가, API·배치 동작 변경 | 에이전트 규칙(`.cursor/rules/**`)만 수정 |
| | `docs/changes/README.md` 같은 **색인·가이드만** 수정 |

---

## 6. 권장 작업 순서 (에이전트·개발자 공통)

1. **진입 문서** 읽기 (`AGENTS.md` → 코딩 가이드)
2. 다음 번호 확정 → (규칙에 따라) **Git 브랜치** 생성
3. `docs/changes/NNN_*/spec.md` **초안** (구현 전에도 가능)
4. 코드·설정 구현
5. `analysis.md`, `changelog.md` 작성 · `spec.md`와 **모순 없게** 맞춤
6. (요청 시) `work_summary.md` 3열 표
7. (요청 시) 커밋 — 커밋 메시지 규칙 준수

---

## 7. 문서 템플릿 (복사해서 `NNN_` 폴더에 붙여넣기)

### 7.1 `spec.md`

```markdown
# 스펙

## 목표

(1~2문장: 누가 / 어떤 화면·기능 / 무엇이 어떻게 바뀌는지)

## 시나리오 (정상)

1. **조건**: …
   **행동**: …
   **기대 결과**: …

2. **조건**: …
   **행동**: …
   **기대 결과**: …

## 예외

- **조건**: …
  **기대 결과**: …

## 범위 밖

- 이번 작업에서 하지 않는 것
```

### 7.2 `analysis.md`

```markdown
# 분석

## 기존 상태

(현재 동작·원인·관련 모듈·파일)

## 설계 선택

(왜 이 방식으로 구현했는지. spec 장문 반복 금지)

## 대안

(검토했으나 채택하지 않은 방법 — 없으면 생략)

## 프로젝트 맥락

(선택: Controller → Service → Repository, DB, 스케줄, 외부 연동 등 이 저장소에 맞는 항목만)
```

### 7.3 `changelog.md`

```markdown
# 변경사항

## 요약

(한 단락)

## 변경 파일

| 경로 | 내용 |
|------|------|
| `path/to/file` | … |

## 동작 차이

- Before: …
- After: …

## 주의

(배포 순서, DB 실행, 환경 변수, 스케줄, 롤백)

## 작업 정리

(해당 시) [`work_summary.md`](work_summary.md)
```

### 7.4 `work_summary.md` (요청 시)

```markdown
# {작업 제목} 작업 정리

| 작업 요약 | 구현 개요 | 상세 단계 · 수정 파일 |
|-----------|-----------|----------------------|
| Before → After 한 문장 | 레이어·흐름 1~2문장 | **1.** … **2.** … 롤백 방법<br><br>---<br>`repo/root/path/file1`<br>`repo/root/path/file2` |
```

- 3열 표의 「상세 단계」는 `<br><br>`로 줄바꿈.
- 수정 파일은 **저장소 루트 기준 전체 경로**.

---

## 8. 첫 샘플 폴더 `001_` (권장)

이식 직후 아래 구조를 만들어 두면, 이후 AI가 **형식만** 따라하기 쉽습니다.

```text
docs/changes/
  README.md                 ← 이 워크플로 요약 + 샘플 링크
  001_add-change-docs/
    spec.md                 ← 「변경 문서화 규칙 도입」 자체를 스펙으로
    analysis.md
    changelog.md
```

`001`의 `spec.md` 목표 예시: *「코드 변경 작업마다 `docs/changes/NNN_*`에 spec·analysis·changelog를 자동 작성한다」*.

---

## 9. `docs/changes/README.md` (프로젝트용 짧은 색인)

다른 프로젝트 루트에 둘 **최소 README** 예시:

```markdown
# 변경 이력 (`docs/changes`)

기능·버그·설정 변경은 **건당 한 폴더** (`NNN_english_snake_summary`).

- 작업 전: 루트 [`AGENTS.md`](../../AGENTS.md)
- 코딩 규칙: [`docs/MODIFICATION_GUIDE.md`](../MODIFICATION_GUIDE.md) (있을 때)
- 형식 샘플: [`001_add-change-docs/`](001_add-change-docs/)
- 이식용 전체 규칙: [`docs/PORTABLE_AI_CHANGE_WORKFLOW.md`](../PORTABLE_AI_CHANGE_WORKFLOW.md)

## 필수 파일

`spec.md` · `analysis.md` · `changelog.md`

## 번호

`docs/changes/` 아래 `^\d{3}_` 폴더만 세어 최댓값 + 1.
```

---

## 10. Cursor 규칙 (`alwaysApply` 예시)

`.cursor/rules/change-documentation.mdc` 로 저장 (프로젝트명·경로는 수정):

```markdown
---
description: 변경 작업 시 docs/changes/NNN_* 문서화
alwaysApply: true
---

# 변경 작업 문서화

구현·수정·버그 수정·설정 변경 **전에** 루트 `AGENTS.md`를 읽는다.

코드·설정을 **실제로 바꾼** 작업이 끝나면:

1. `docs/changes/NNN_english_snake_summary/` 생성 (번호: `^\d{3}_` 폴더 최댓값 + 1)
2. `spec.md`, `analysis.md`, `changelog.md` 필수 작성 (샘플: `docs/changes/001_add-change-docs/`)
3. 새 `NNN_`이면: `<base-branch>` pull → `feature/{summary-with-hyphens}` 브랜치 생성 후 작업
4. 사용자가 「작업 정리」「작업내역」 요청 시 `work_summary.md` 3열 표 (채팅만으로 끝내지 않음)

## 생략

- 질문·설명만, 코드 미변경
- `.cursor/rules/**` 또는 `docs/changes/README.md` 등 메타만 수정

## 커밋

- 사용자 요청 시만. 메시지: `docs/COMMIT_CONVENTION.md` (또는 팀 규칙)
- IDE·로컬 전용 파일은 커밋 제외
```

---

## 11. `AGENTS.md`에 넣을 절 (복사용)

```markdown
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

1. `AGENTS.md` · 코딩 가이드 확인
2. `NNN_` 확정 → (신규 시) `<base>` pull → `feature/...` 브랜치
3. `spec.md` 초안 → 구현 → `analysis.md`, `changelog.md`
4. (요청 시) `work_summary.md` · 커밋

### 생략

질문만, 코드 미변경, 메타 문서만 수정 → `NNN_` 폴더 생성 안 함.
```

---

## 12. 에이전트에게 붙일 한 줄 프롬프트 (선택)

다른 프로젝트 채팅에 매번 붙이지 않아도 되도록, 위 Cursor 규칙 + `AGENTS.md`에 두는 것을 권장합니다.

```text
이 저장소에서 코드·설정을 바꾸는 작업은 docs/PORTABLE_AI_CHANGE_WORKFLOW.md와 AGENTS.md의 변경 문서화 절을 따른다.
작업 종료 시 docs/changes/NNN_*에 spec·analysis·changelog를 작성한다.
```

---

## 13. 번호 확인 (로컬)

**PowerShell**

```powershell
Get-ChildItem docs/changes -Directory |
  Where-Object { $_.Name -match '^\d{3}_' } |
  ForEach-Object { [int]$_.Name.Substring(0,3) } |
  Measure-Object -Maximum
```

**bash**

```bash
ls -d docs/changes/[0-9][0-9][0-9]_* 2>/dev/null | sed 's|.*/||;s/_.*//' | sort -n | tail -1
```

최댓값이 `5`이면 다음 폴더는 `006_…`.

---

## 14. 문서 역할 구분 (팀 합의용)

| 문서 | 답하는 질문 |
|------|-------------|
| 코딩 가이드 (`MODIFICATION_GUIDE` 등) | **어떻게** 짜는가 (패턴·네이밍·레이어) |
| `docs/changes/NNN_*` | **무엇을** 왜 바꿨는가 (스펙·이력·배포 메모) |
| `AGENTS.md` | AI가 빠르게 맥락 잡는 **요약 + 체크리스트** |

---

## 15. NIFOS에서 가져온 이 워크플로의 출처

이 템플릿은 [NIFOS](https://github.com/) `docs/changes/`, `AGENTS.md` §4, `.cursor/rules/nifos-change-documentation.mdc` 를 **프로젝트 중립**으로 일반화한 것입니다. NIFOS 전용 항목(IRIS synch, Tiles 4세그먼트 등)은 §2 프로젝트 설정 표에만 두고 본문에서는 제거했습니다.

---

*마지막 업데이트: 워크플로 템플릿 v1 — 다른 저장소에 복사·수정하여 사용.*

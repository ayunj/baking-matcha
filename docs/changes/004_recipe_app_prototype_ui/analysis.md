# 분석

## 현재 vs 프로토타입

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 네비게이션 | 단일 앱 + 상단 탭 3개 | auth → home → section(탭) |
| 데이터 | 베이킹 1세트 | baking / food / drink 섹션별 recipes·pantry |
| 인증 | 없음 | mock 로그인·회원가입 |
| 레이아웃 | 카드형 shell | 전체 화면 `appRoot` + 섹션 흰색 탭바 |

## 구조

- `AppContext`: `screen`, `user`, `section`, `sectionData`, auth·navigation API
- `src/types/section.ts`: 섹션 메타·이모지·홈 카드 정의
- `src/data/mock-data.ts`: 프로토타입과 동일한 초기 mock 데이터

## 리스크

- 섹션 간 recipe/pantry id는 독립(섹션마다 `id: 1` 가능) — DB 연동 시 `(section, id)` 복합 키 필요
- `Sidebar.tsx`는 미사용(레거시); 후속 PR에서 제거 가능

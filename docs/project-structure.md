# 프로젝트 구조

## 루트

```
baking-matcha/
├── docs/                    # 프로젝트 문서 (이 폴더)
├── prototype/               # HTML 프로토타입 (참고용)
├── supabase/
│   └── migrations/          # DB 스키마 SQL
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── lib/
│   ├── styles/
│   └── types/
├── .env.example             # 환경 변수 예시 (커밋됨)
├── .env*.local              # 실제 키 (gitignore, 커밋 안 됨)
└── package.json
```

## `src/app`

| 파일 | 역할 |
|------|------|
| `layout.tsx` | 폰트, `SupabaseProvider` + `AppProvider` |
| `page.tsx` | 메인 페이지, `BakingApp` 렌더 |
| `globals.css` | 전역 리셋·베이스 스타일 |

## `src/components`

| 경로 | 역할 |
|------|------|
| `BakingApp.tsx` | 탭·모달 오케스트레이션 |
| `dashboard/DashboardPage.tsx` | 대시보드 통계·최근 레시피 |
| `recipes/RecipesPage.tsx` | 레시피 목록 |
| `recipes/RecipeFormModal.tsx` | 레시피 추가/수정 |
| `recipes/RecipeDetailModal.tsx` | 레시피 상세 |
| `pantry/PantryPage.tsx` | 재료 창고 |
| `pantry/PantryFormModal.tsx` | 재료 추가/수정 |
| `layout/Sidebar.tsx` | 탭 네비 + DB 상태 |
| `layout/DbConnectionStatus.tsx` | Supabase 연결 상태 뱃지 |
| `icons/`, `ui/` | 아이콘 스프라이트, 모달, 버튼 |

## `src/context`

| 파일 | 역할 |
|------|------|
| `AppContext.tsx` | 탭, recipes/pantry state, CRUD (mock) |
| `SupabaseContext.tsx` | Supabase 클라이언트, `status`, `tablesReady` |

### `useSupabase()` 반환값

| 필드 | 설명 |
|------|------|
| `client` | `SupabaseClient \| null` |
| `status` | `checking` \| `connected` \| `connected_no_tables` \| `misconfigured` \| `error` |
| `tablesReady` | `recipes` 테이블 접근 가능 여부 |
| `errorMessage` | 실패 시 메시지 |

## `src/lib/supabase`

| 파일 | 역할 |
|------|------|
| `client.ts` | `getSupabaseClient()`, `isSupabaseConfigured()` |
| `check-connection.ts` | Auth + `recipes` 테이블 프로브로 연결 검사 |

## `src/data` · `src/types`

| 파일 | 역할 |
|------|------|
| `mock-data.ts` | 초기 레시피·재료 샘플 |
| `types/recipe.ts` | `Recipe`, `RecipeStep` |
| `types/pantry.ts` | `PantryItem` |

## `src/lib` (기타)

| 파일 | 역할 |
|------|------|
| `ingredient-scale.ts` | 재료 분량 환산 유틸 |

## Supabase 마이그레이션

`supabase/migrations/20250529000000_initial.sql`

- `recipes`, `pantry_items` 테이블 생성
- RLS 활성화 + 개발용 전체 허용 정책

Supabase 대시보드 **SQL Editor**에 붙여 넣어 실행합니다.

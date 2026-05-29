# Supabase

## 프로젝트 생성 시 참고

- Git 없이 Supabase 프로젝트만 만들어도 됩니다.
- 나중에 **Project Settings → Integrations → GitHub**에서 저장소 연결 가능 (마이그레이션·브랜칭용).
- 이 앱의 런타임 연동은 **URL + Publishable key**만으로 충분합니다.

## 필요한 값

Supabase 대시보드 → **Project Settings → API** (또는 **API Keys**)

| 용도 | Supabase | 앱 환경 변수 |
|------|----------|----------------|
| 프로젝트 URL | Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| 공개 키 | Publishable key (`sb_publishable_...`) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

**넣지 않을 것:** Secret key (`sb_secret_...`)

## 로컬 설정

1. 루트에 `.env.local` 생성 (`.gitignore`에 포함됨)
2. `.env.example` 내용을 복사 후 실제 값으로 교체

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

3. `npm run dev` 실행 후 홈 화면 DB 상태 확인

## 연결 확인 로직

`src/lib/supabase/check-connection.ts`:

1. `auth.getSession()` — URL·키 유효성
2. `from('recipes').select(..., { head: true })` — `recipes` 테이블 존재 여부
   - 테이블 없음 → `tablesReady: false`, 상태 `connected_no_tables`
   - 성공 → `tablesReady: true`, 상태 `connected`

## DB 상태 표시

`DbConnectionStatus` (`src/components/layout/DbConnectionStatus.tsx`)

| 표시 | 의미 |
|------|------|
| DB 확인 중… | 연결 검사 중 |
| DB 연결됨 | 연결 OK + `recipes` 테이블 있음 |
| DB 연결됨 · 테이블 준비 필요 | 연결 OK, 마이그레이션 미실행 |
| DB 미설정 (.env) | env 없음 |
| DB 연결 실패 | 키/URL 오류 등 (hover 시 메시지) |

## 스키마 개요 (`prototype/schema_2.sql` 기준)

| 객체 | 설명 |
|------|------|
| `section_type` | enum: `baking`, `food`, `drink` |
| `users` | 앱 로그인 계정 (username, bcrypt `password`, `name`) |
| `categories` | 기본 카테고리(`user_id` NULL) + 유저 커스텀(「기타」 직접 입력) |
| `recipes` | 레시피 헤더 (`category_id` FK, 오븐 필드 등) |
| `recipe_ingredients` | 재료 행 (`sort_order`, `content`) |
| `recipe_steps` | 단계 행 (`description`, `memo`) |
| `pantry` | 재료 창고 (`user_id` + `section` + `name` 유니크) |

앱 ↔ DB 매핑:

| DB | 앱 (`Recipe` / `PantryItem`) |
|----|------------------------------|
| `categories.name` (조인) | `cat` |
| `categories.id` | `categoryId` |
| `recipes.oven_preheat` | `preheat` |
| `recipes.oven_temp` | `bakeTemp` |
| `recipes.oven_time` | `bakeTime` |
| `recipe_ingredients.content` | `ingredients[]` |
| `recipe_steps.description` / `memo` | `steps[].text` / `steps[].memo` |
| `pantry.quantity` | `qty` |
| `pantry.is_low` | `low` |

## 마이그레이션 적용

파일:

| 파일 | 용도 |
|------|------|
| `supabase/migrations/20250529000000_initial.sql` | **신규** — schema_2 전체 |
| `supabase/migrations/20250529200000_categories_schema.sql` | `recipes.category` → `category_id` 업그레이드 |
| `supabase/migrations/20250529100000_upgrade_legacy_jsonb_schema.sql` | 예전 jsonb `pantry_items` 제거만 |

### SQL Editor (권장)

1. **신규 DB:** `20250529000000_initial.sql` → **Run**
2. **이미 `recipes.category`(VARCHAR) 로 만든 DB:** `20250529200000_categories_schema.sql` → **Run**
3. **아주 옛 jsonb 스키마:** `20250529100000_…` → `20250529000000_initial.sql` → (2번 필요 시)
4. 앱 새로고침 → **DB 연결됨** 확인

### 예전 스키마와의 차이

- `pantry_items` → `pantry` (섹션·유저 FK)
- `recipes` jsonb `ingredients`/`steps` → `recipe_ingredients`, `recipe_steps` 테이블
- `bigint` identity → `UUID`
- `users` 테이블 신설 (앱 자체 인증용, `auth.users` 와 별도)

## RLS·보안 (운영 전)

현재 정책은 개발 편의를 위해 anon 전체 허용입니다. 공개 서비스 전에:

- Supabase Auth 또는 앱 로그인 + 서버 API
- `auth.uid()` / `user_id` 기반 RLS
- `users.password`는 반드시 bcrypt 해시만 저장

을 검토하세요.

## 코드에서 Supabase 쓰기

```tsx
import { useSupabase } from "@/context/SupabaseContext";

function Example() {
  const { client, tablesReady, status } = useSupabase();

  if (!client || !tablesReady) return null;

  const { data, error } = await client.from("recipes").select("*");
}
```

## CRUD 연동 (구현됨)

`tablesReady` 이고 로그인한 경우 `AppContext`가 repository로 DB에 읽기/쓰기합니다.

| 경로 | 역할 |
|------|------|
| `src/lib/supabase/repositories/` | users, categories, recipes, pantry CRUD |
| `src/lib/supabase/mappers.ts` | row ↔ `Recipe` / `PantryItem` |
| `src/context/AppContext.tsx` | DB/mock 분기, `sessionStorage` 세션 |

DB 미연결 시 mock-data 폴백.

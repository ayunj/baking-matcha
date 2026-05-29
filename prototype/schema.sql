-- =====================================================
-- 나의 레시피 노트 - DB 스키마 (PostgreSQL)
-- Supabase 적용본: supabase/migrations/20250529000000_initial.sql
-- (최신) categories + category_id: prototype/schema_2.sql, 20250529200000_categories_schema.sql
-- (TIMESTAMPTZ · RLS · public 스키마 명시)
-- =====================================================


-- 섹션 타입 enum
CREATE TYPE section_type AS ENUM ('baking', 'food', 'drink');


-- 유저 테이블
CREATE TABLE users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(20)   NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  name        VARCHAR(50)   NOT NULL,
  created_at  TIMESTAMPTZ   DEFAULT now(),
  updated_at  TIMESTAMPTZ   DEFAULT now()
);

COMMENT ON TABLE  users              IS '로그인 계정 정보';
COMMENT ON COLUMN users.id           IS '유저 고유 ID';
COMMENT ON COLUMN users.username     IS '아이디 (영문+숫자 4~20자, 중복 불가)';
COMMENT ON COLUMN users.password     IS '비밀번호 — bcrypt 해시 저장, 평문 금지';
COMMENT ON COLUMN users.name         IS '표시 이름 (예: 홍길동)';
COMMENT ON COLUMN users.created_at   IS '가입일';
COMMENT ON COLUMN users.updated_at   IS '정보 수정일';


-- 레시피 테이블
CREATE TABLE recipes (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section       section_type  NOT NULL,
  emoji         VARCHAR(10)   NOT NULL,
  name          VARCHAR(100)  NOT NULL,
  category      VARCHAR(50)   NOT NULL,
  serving       VARCHAR(50),
  oven_preheat  INT,
  oven_temp     INT,
  oven_time     INT,
  note          TEXT,
  created_at    TIMESTAMPTZ   DEFAULT now(),
  updated_at    TIMESTAMPTZ   DEFAULT now()
);

COMMENT ON TABLE  recipes               IS '유저가 작성한 레시피 기본 정보';
COMMENT ON COLUMN recipes.id            IS '레시피 고유 ID';
COMMENT ON COLUMN recipes.user_id       IS '작성자 — 탈퇴 시 레시피도 함께 삭제(CASCADE)';
COMMENT ON COLUMN recipes.section       IS '섹션 구분 (baking / food / drink)';
COMMENT ON COLUMN recipes.emoji         IS '대표 이모지 (예: 🧁)';
COMMENT ON COLUMN recipes.name          IS '레시피 이름';
COMMENT ON COLUMN recipes.category      IS '카테고리 (예: 머핀, 한식, 커피)';
COMMENT ON COLUMN recipes.serving       IS '분량 (예: 12개, 2인분)';
COMMENT ON COLUMN recipes.oven_preheat  IS '오븐 예열 온도(°C) — 베이킹 섹션에서만 사용, 나머지 NULL';
COMMENT ON COLUMN recipes.oven_temp     IS '오븐 굽는 온도(°C)';
COMMENT ON COLUMN recipes.oven_time     IS '오븐 굽는 시간(분)';
COMMENT ON COLUMN recipes.note          IS '전체 메모 / 팁';
COMMENT ON COLUMN recipes.created_at    IS '작성일';
COMMENT ON COLUMN recipes.updated_at    IS '수정일';


-- 레시피 재료 테이블
CREATE TABLE recipe_ingredients (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID          NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  sort_order  INT           NOT NULL DEFAULT 0,
  content     VARCHAR(200)  NOT NULL
);

COMMENT ON TABLE  recipe_ingredients              IS '레시피별 재료 목록';
COMMENT ON COLUMN recipe_ingredients.id           IS '재료 고유 ID';
COMMENT ON COLUMN recipe_ingredients.recipe_id    IS '소속 레시피 — 레시피 삭제 시 함께 삭제';
COMMENT ON COLUMN recipe_ingredients.sort_order   IS '표시 순서 (0부터 시작)';
COMMENT ON COLUMN recipe_ingredients.content      IS '재료 내용 — "박력분 200g" 형태 그대로 저장, 배수 계산은 앱단에서 처리';


-- 레시피 단계 테이블
CREATE TABLE recipe_steps (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID    NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  sort_order  INT     NOT NULL DEFAULT 0,
  description TEXT    NOT NULL,
  memo        TEXT
);

COMMENT ON TABLE  recipe_steps              IS '레시피 만드는 방법 (단계별)';
COMMENT ON COLUMN recipe_steps.id           IS '단계 고유 ID';
COMMENT ON COLUMN recipe_steps.recipe_id    IS '소속 레시피';
COMMENT ON COLUMN recipe_steps.sort_order   IS '단계 순서 (0부터 시작)';
COMMENT ON COLUMN recipe_steps.description  IS '단계 설명 (예: 오븐을 175°C로 예열하세요.)';
COMMENT ON COLUMN recipe_steps.memo         IS '단계별 추가 메모 — 선택 입력 (예: 실온 버터를 꼭 사용하세요.)';


-- 재료 창고 테이블
CREATE TABLE pantry (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section     section_type  NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  quantity    VARCHAR(50),
  category    VARCHAR(50),
  is_low      BOOLEAN       DEFAULT false,
  created_at  TIMESTAMPTZ   DEFAULT now(),
  UNIQUE(user_id, section, name)
);

COMMENT ON TABLE  pantry             IS '유저가 집에 보유한 재료 창고 — 섹션별 독립 관리';
COMMENT ON COLUMN pantry.id          IS '재료 고유 ID';
COMMENT ON COLUMN pantry.user_id     IS '소유자 — 탈퇴 시 창고도 함께 삭제';
COMMENT ON COLUMN pantry.section     IS '섹션 구분 (baking / food / drink)';
COMMENT ON COLUMN pantry.name        IS '재료 이름 (예: 박력분)';
COMMENT ON COLUMN pantry.quantity    IS '보유 수량 (예: 500g, 1kg)';
COMMENT ON COLUMN pantry.category    IS '재료 분류 (예: 밀가루류, 양념/소스)';
COMMENT ON COLUMN pantry.is_low      IS '재고 부족 여부 — true 이면 앱에서 빨간 배지 표시';
COMMENT ON COLUMN pantry.created_at  IS '등록일';


-- 인덱스
CREATE INDEX idx_recipes_user_section  ON recipes(user_id, section);    -- 유저별 섹션 레시피 목록 조회
CREATE INDEX idx_pantry_user_section   ON pantry(user_id, section);     -- 유저별 섹션 창고 조회
CREATE INDEX idx_ingredients_recipe    ON recipe_ingredients(recipe_id, sort_order); -- 재료 순서 조회
CREATE INDEX idx_steps_recipe          ON recipe_steps(recipe_id, sort_order);       -- 단계 순서 조회


-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at IS '레코드 수정 시 updated_at을 현재 시각으로 자동 갱신';

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

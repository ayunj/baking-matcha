-- =====================================================
-- 나의 레시피 노트 - DB 스키마 (PostgreSQL)
-- =====================================================


-- =====================================================
-- 섹션 타입 enum
-- =====================================================
CREATE TYPE section_type AS ENUM ('baking', 'food', 'drink');

COMMENT ON TYPE section_type IS '앱 섹션 구분 — 베이킹(baking) / 음식(food) / 음료(drink)';


-- =====================================================
-- 유저 테이블
-- =====================================================
CREATE TABLE users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(20)   NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  name        VARCHAR(50)   NOT NULL,
  created_at  TIMESTAMP     DEFAULT now(),
  updated_at  TIMESTAMP     DEFAULT now()
);

COMMENT ON TABLE  users             IS '로그인 계정 정보';
COMMENT ON COLUMN users.id          IS '유저 고유 ID';
COMMENT ON COLUMN users.username    IS '아이디 (영문+숫자 4~20자, 중복 불가)';
COMMENT ON COLUMN users.password    IS '비밀번호 — bcrypt 해시 저장, 평문 금지';
COMMENT ON COLUMN users.name        IS '표시 이름 (예: 홍길동)';
COMMENT ON COLUMN users.created_at  IS '가입일';
COMMENT ON COLUMN users.updated_at  IS '정보 수정일';


-- =====================================================
-- 카테고리 테이블
-- 기본 카테고리(is_default=true)와 유저 커스텀 카테고리 함께 관리
-- 기본 카테고리: user_id = NULL, is_default = true
-- 커스텀 카테고리: user_id = 해당 유저, is_default = false
-- =====================================================
CREATE TABLE categories (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  section     section_type  NOT NULL,
  name        VARCHAR(50)   NOT NULL,
  is_default  BOOLEAN       NOT NULL DEFAULT false,
  user_id     UUID          REFERENCES users(id) ON DELETE CASCADE,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     DEFAULT now(),
  UNIQUE(section, name, user_id)  -- 같은 섹션 내 같은 유저의 카테고리명 중복 불가 (user_id NULL 포함)
);

COMMENT ON TABLE  categories              IS '레시피 카테고리 — 기본값(is_default=true)과 유저 커스텀(is_default=false) 함께 관리';
COMMENT ON COLUMN categories.id           IS '카테고리 고유 ID';
COMMENT ON COLUMN categories.section      IS '소속 섹션 (baking / food / drink)';
COMMENT ON COLUMN categories.name         IS '카테고리 이름 (예: 케이크, 한식, 마카롱)';
COMMENT ON COLUMN categories.is_default   IS '기본 카테고리 여부 — true: 앱 기본 제공, false: 유저가 직접 추가';
COMMENT ON COLUMN categories.user_id      IS '카테고리 소유자 — 기본 카테고리는 NULL, 커스텀은 해당 유저 ID';
COMMENT ON COLUMN categories.sort_order   IS '화면 표시 순서';
COMMENT ON COLUMN categories.created_at   IS '생성일';


-- =====================================================
-- 기본 카테고리 초기 데이터
-- =====================================================

-- 베이킹
INSERT INTO categories (section, name, is_default, sort_order) VALUES
  ('baking', '케이크',     true, 1),
  ('baking', '쿠키',       true, 2),
  ('baking', '빵',         true, 3),
  ('baking', '파이/타르트', true, 4),
  ('baking', '머핀',       true, 5);

-- 음식
INSERT INTO categories (section, name, is_default, sort_order) VALUES
  ('food', '한식',   true, 1),
  ('food', '중식',   true, 2),
  ('food', '일식',   true, 3),
  ('food', '양식',   true, 4),
  ('food', '동남아', true, 5);

-- 음료
INSERT INTO categories (section, name, is_default, sort_order) VALUES
  ('drink', '커피',   true, 1),
  ('drink', '티',     true, 2),
  ('drink', '스무디', true, 3),
  ('drink', '에이드', true, 4),
  ('drink', '주스',   true, 5);


-- =====================================================
-- 레시피 테이블
-- =====================================================
CREATE TABLE recipes (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section       section_type  NOT NULL,
  category_id   UUID          NOT NULL REFERENCES categories(id),
  emoji         VARCHAR(10)   NOT NULL,
  name          VARCHAR(100)  NOT NULL,
  serving       VARCHAR(50),
  oven_preheat  INT,
  oven_temp     INT,
  oven_time     INT,
  note          TEXT,
  created_at    TIMESTAMP     DEFAULT now(),
  updated_at    TIMESTAMP     DEFAULT now()
);

COMMENT ON TABLE  recipes               IS '유저가 작성한 레시피 기본 정보';
COMMENT ON COLUMN recipes.id            IS '레시피 고유 ID';
COMMENT ON COLUMN recipes.user_id       IS '작성자 — 탈퇴 시 레시피도 함께 삭제(CASCADE)';
COMMENT ON COLUMN recipes.section       IS '섹션 구분 (baking / food / drink)';
COMMENT ON COLUMN recipes.category_id   IS '카테고리 FK — categories 테이블 참조 (기본 또는 커스텀)';
COMMENT ON COLUMN recipes.emoji         IS '대표 이모지 (예: 🧁)';
COMMENT ON COLUMN recipes.name          IS '레시피 이름';
COMMENT ON COLUMN recipes.serving       IS '분량 (예: 12개, 2인분)';
COMMENT ON COLUMN recipes.oven_preheat  IS '오븐 예열 온도(°C) — 베이킹 섹션에서만 사용, 나머지 NULL';
COMMENT ON COLUMN recipes.oven_temp     IS '오븐 굽는 온도(°C)';
COMMENT ON COLUMN recipes.oven_time     IS '오븐 굽는 시간(분)';
COMMENT ON COLUMN recipes.note          IS '전체 메모 / 팁';
COMMENT ON COLUMN recipes.created_at    IS '작성일';
COMMENT ON COLUMN recipes.updated_at    IS '수정일';


-- =====================================================
-- 레시피 재료 테이블
-- =====================================================
CREATE TABLE recipe_ingredients (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID          NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  sort_order  INT           NOT NULL DEFAULT 0,
  content     VARCHAR(200)  NOT NULL
);

COMMENT ON TABLE  recipe_ingredients            IS '레시피별 재료 목록';
COMMENT ON COLUMN recipe_ingredients.id         IS '재료 고유 ID';
COMMENT ON COLUMN recipe_ingredients.recipe_id  IS '소속 레시피 — 레시피 삭제 시 함께 삭제';
COMMENT ON COLUMN recipe_ingredients.sort_order IS '표시 순서 (0부터 시작)';
COMMENT ON COLUMN recipe_ingredients.content    IS '재료 내용 — "박력분 200g" 형태 그대로 저장, 배수 계산은 앱단에서 처리';


-- =====================================================
-- 레시피 단계 테이블
-- =====================================================
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


-- =====================================================
-- 재료 창고 테이블
-- =====================================================
CREATE TABLE pantry (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  section     section_type  NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  quantity    VARCHAR(50),
  category    VARCHAR(50),
  is_low      BOOLEAN       DEFAULT false,
  created_at  TIMESTAMP     DEFAULT now(),
  UNIQUE(user_id, section, name)
);

COMMENT ON TABLE  pantry            IS '유저가 집에 보유한 재료 창고 — 섹션별 독립 관리';
COMMENT ON COLUMN pantry.id         IS '재료 고유 ID';
COMMENT ON COLUMN pantry.user_id    IS '소유자 — 탈퇴 시 창고도 함께 삭제';
COMMENT ON COLUMN pantry.section    IS '섹션 구분 (baking / food / drink)';
COMMENT ON COLUMN pantry.name       IS '재료 이름 (예: 박력분)';
COMMENT ON COLUMN pantry.quantity   IS '보유 수량 (예: 500g, 1kg)';
COMMENT ON COLUMN pantry.category   IS '재료 분류 (예: 밀가루류, 양념/소스)';
COMMENT ON COLUMN pantry.is_low     IS '재고 부족 여부 — true 이면 앱에서 빨간 배지 표시';
COMMENT ON COLUMN pantry.created_at IS '등록일';


-- =====================================================
-- 인덱스
-- =====================================================
CREATE INDEX idx_recipes_user_section   ON recipes(user_id, section);
CREATE INDEX idx_recipes_category       ON recipes(category_id);
CREATE INDEX idx_categories_section     ON categories(section, is_default);
CREATE INDEX idx_categories_user        ON categories(user_id, section);
CREATE INDEX idx_pantry_user_section    ON pantry(user_id, section);
CREATE INDEX idx_ingredients_recipe     ON recipe_ingredients(recipe_id, sort_order);
CREATE INDEX idx_steps_recipe           ON recipe_steps(recipe_id, sort_order);

COMMENT ON INDEX idx_recipes_user_section  IS '유저별 섹션 레시피 목록 조회';
COMMENT ON INDEX idx_recipes_category      IS '카테고리별 레시피 필터 조회';
COMMENT ON INDEX idx_categories_section    IS '섹션별 기본/커스텀 카테고리 목록 조회';
COMMENT ON INDEX idx_categories_user       IS '유저별 커스텀 카테고리 조회';
COMMENT ON INDEX idx_pantry_user_section   IS '유저별 섹션 창고 조회';
COMMENT ON INDEX idx_ingredients_recipe    IS '레시피 재료 순서대로 조회';
COMMENT ON INDEX idx_steps_recipe          IS '레시피 단계 순서대로 조회';


-- =====================================================
-- updated_at 자동 갱신 트리거
-- =====================================================
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

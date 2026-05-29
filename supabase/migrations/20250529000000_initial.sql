-- prototype/schema_2.sql — Supabase(public) 초기 스키마
-- SQL Editor: 이 파일 실행 후 (기존 category 컬럼 DB면) 20250529200000_categories_schema.sql

DO $$
BEGIN
  CREATE TYPE public.section_type AS ENUM ('baking', 'food', 'drink');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  username    VARCHAR(20)   NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  name        VARCHAR(50)   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  section     public.section_type NOT NULL,
  name        VARCHAR(50)   NOT NULL,
  is_default  BOOLEAN       NOT NULL DEFAULT false,
  user_id     UUID          REFERENCES public.users(id) ON DELETE CASCADE,
  sort_order  INT           NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (section, name, user_id)
);

INSERT INTO public.categories (section, name, is_default, sort_order) VALUES
  ('baking', '케이크', true, 1),
  ('baking', '쿠키', true, 2),
  ('baking', '빵', true, 3),
  ('baking', '파이/타르트', true, 4),
  ('baking', '머핀', true, 5),
  ('food', '한식', true, 1),
  ('food', '중식', true, 2),
  ('food', '일식', true, 3),
  ('food', '양식', true, 4),
  ('food', '동남아', true, 5),
  ('drink', '커피', true, 1),
  ('drink', '티', true, 2),
  ('drink', '스무디', true, 3),
  ('drink', '에이드', true, 4),
  ('drink', '주스', true, 5)
ON CONFLICT (section, name, user_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.recipes (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  section       public.section_type NOT NULL,
  category_id   UUID          NOT NULL REFERENCES public.categories(id),
  emoji         VARCHAR(10)   NOT NULL,
  name          VARCHAR(100)  NOT NULL,
  serving       VARCHAR(50),
  oven_preheat  INT,
  oven_temp     INT,
  oven_time     INT,
  note          TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID          NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  sort_order  INT           NOT NULL DEFAULT 0,
  content     VARCHAR(200)  NOT NULL
);

CREATE TABLE IF NOT EXISTS public.recipe_steps (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id   UUID    NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  sort_order  INT     NOT NULL DEFAULT 0,
  description TEXT    NOT NULL,
  memo        TEXT
);

CREATE TABLE IF NOT EXISTS public.pantry (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  section     public.section_type NOT NULL,
  name        VARCHAR(100)  NOT NULL,
  quantity    VARCHAR(50),
  category    VARCHAR(50),
  is_low      BOOLEAN       NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (user_id, section, name)
);

CREATE INDEX IF NOT EXISTS idx_recipes_user_section ON public.recipes (user_id, section);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes (category_id);
CREATE INDEX IF NOT EXISTS idx_categories_section ON public.categories (section, is_default);
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories (user_id, section);
CREATE INDEX IF NOT EXISTS idx_pantry_user_section ON public.pantry (user_id, section);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe ON public.recipe_ingredients (recipe_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_steps_recipe ON public.recipe_steps (recipe_id, sort_order);

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trg_recipes_updated_at ON public.recipes;
CREATE TRIGGER trg_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_all ON public.users;
CREATE POLICY users_all ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS categories_all ON public.categories;
CREATE POLICY categories_all ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS recipes_all ON public.recipes;
CREATE POLICY recipes_all ON public.recipes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS recipe_ingredients_all ON public.recipe_ingredients;
CREATE POLICY recipe_ingredients_all ON public.recipe_ingredients FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS recipe_steps_all ON public.recipe_steps;
CREATE POLICY recipe_steps_all ON public.recipe_steps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS pantry_all ON public.pantry;
CREATE POLICY pantry_all ON public.pantry FOR ALL USING (true) WITH CHECK (true);

-- prototype/schema_2.sql — categories 테이블 + recipes.category_id
-- 기존 recipes.category(VARCHAR) 스키마에서 업그레이드

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

COMMENT ON TABLE public.categories IS '레시피 카테고리 — 기본(is_default) + 유저 커스텀';

-- 기본 카테고리 시드 (중복 시 건너뜀)
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

-- recipes: category_id 추가 및 데이터 이전
DO $migrate$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'recipes'
      AND column_name = 'category_id'
  ) THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'recipes'
      AND column_name = 'category'
  ) THEN
    -- 신규 설치(initial v2)는 initial.sql 에서 category_id 로 생성됨
    RETURN;
  END IF;

  ALTER TABLE public.recipes
    ADD COLUMN category_id UUID REFERENCES public.categories(id);

  UPDATE public.recipes r
  SET category_id = c.id
  FROM public.categories c
  WHERE c.section = r.section
    AND c.name = r.category
    AND c.is_default = true;

  INSERT INTO public.categories (section, name, is_default, user_id, sort_order)
  SELECT DISTINCT r.section, r.category, false, r.user_id, 99
  FROM public.recipes r
  WHERE r.category_id IS NULL
    AND r.category IS NOT NULL
    AND trim(r.category) <> ''
  ON CONFLICT (section, name, user_id) DO NOTHING;

  UPDATE public.recipes r
  SET category_id = c.id
  FROM public.categories c
  WHERE r.category_id IS NULL
    AND c.section = r.section
    AND c.name = r.category
    AND c.user_id = r.user_id
    AND c.is_default = false;

  UPDATE public.recipes r
  SET category_id = c.id
  FROM public.categories c
  WHERE r.category_id IS NULL
    AND c.section = r.section
    AND c.name = r.category
    AND c.is_default = true;

  UPDATE public.recipes r
  SET category_id = (
    SELECT c.id FROM public.categories c
    WHERE c.section = r.section AND c.is_default = true
    ORDER BY c.sort_order
    LIMIT 1
  )
  WHERE r.category_id IS NULL;

  ALTER TABLE public.recipes DROP COLUMN category;
  ALTER TABLE public.recipes ALTER COLUMN category_id SET NOT NULL;
END
$migrate$;

CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes (category_id);
CREATE INDEX IF NOT EXISTS idx_categories_section ON public.categories (section, is_default);
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories (user_id, section);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS categories_all ON public.categories;
CREATE POLICY categories_all ON public.categories FOR ALL USING (true) WITH CHECK (true);

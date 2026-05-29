-- 예전 JSONB 스키마(pantry_items / recipes.cat) 제거만 수행
-- 이후 20250529000000_initial.sql → (category 컬럼 DB면) 20250529200000_categories_schema.sql 순서로 실행

DO $upgrade$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'pantry_items'
  )
  OR EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'recipes'
      AND column_name = 'cat'
  ) THEN
    DROP POLICY IF EXISTS pantry_all ON public.pantry_items;
    DROP POLICY IF EXISTS recipes_all ON public.recipes;
    DROP TABLE IF EXISTS public.pantry_items CASCADE;
    DROP TABLE IF EXISTS public.recipes CASCADE;
    RAISE NOTICE 'legacy jsonb tables removed — run 20250529000000_initial.sql next';
  END IF;
END
$upgrade$;

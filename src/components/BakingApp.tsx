"use client";

import { useMemo, useState } from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { HomeScreen } from "@/components/home/HomeScreen";
import { IconSprite } from "@/components/icons/IconSprite";
import { SectionTabbar } from "@/components/layout/SectionTabbar";
import { PantryFormModal } from "@/components/pantry/PantryFormModal";
import { PantryPage } from "@/components/pantry/PantryPage";
import { RecipeDetailModal } from "@/components/recipes/RecipeDetailModal";
import { RecipeFormModal } from "@/components/recipes/RecipeFormModal";
import { RecipesPage } from "@/components/recipes/RecipesPage";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

export function BakingApp() {
  const { screen, tab, recipes, sectionConfig, deleteRecipe, deletePantry } =
    useApp();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [recipeFormId, setRecipeFormId] = useState<string | null | "new">(null);
  const [pantryFormId, setPantryFormId] = useState<string | null | "new">(null);

  const detailRecipe = useMemo(
    () => recipes.find((r) => r.id === detailId) ?? null,
    [recipes, detailId],
  );

  const openRecipe = (id: string) => setDetailId(id);
  const openRecipeForm = (id?: string) =>
    setRecipeFormId(id != null ? id : "new");
  const openPantryForm = (id?: string) =>
    setPantryFormId(id != null ? id : "new");

  const handleDeleteRecipe = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    try {
      await deleteRecipe(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했어요.");
    }
  };

  const handleDeletePantry = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    try {
      await deletePantry(id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했어요.");
    }
  };

  return (
    <div className={styles.appRoot}>
      <IconSprite />

      <div className={screen === "auth" ? styles.screenOn : styles.screen}>
        <AuthScreen />
      </div>

      <div className={screen === "home" ? styles.screenOn : styles.screen}>
        <HomeScreen />
      </div>

      <div className={screen === "section" ? styles.screenOn : styles.screen}>
        <div className={styles.secOuter}>
          <SectionTabbar />
          <div className={styles.secContent}>
            <div className={styles.secBody}>
              {tab === "dash" ? (
                <DashboardPage
                  onOpenRecipe={openRecipe}
                  onAddRecipe={() => openRecipeForm()}
                />
              ) : null}
              {tab === "recipes" ? (
                <RecipesPage
                  onOpenRecipe={openRecipe}
                  onAddRecipe={() => openRecipeForm()}
                  onEditRecipe={(id) => openRecipeForm(id)}
                  onDeleteRecipe={handleDeleteRecipe}
                />
              ) : null}
              {tab === "pantry" ? (
                <PantryPage
                  onAddItem={() => openPantryForm()}
                  onEditItem={(id) => openPantryForm(id)}
                  onDeleteItem={handleDeletePantry}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <RecipeDetailModal
        recipe={detailRecipe}
        showOven={sectionConfig.showOven}
        open={detailId != null}
        onClose={() => setDetailId(null)}
        onEdit={(id) => {
          setDetailId(null);
          openRecipeForm(id);
        }}
      />

      <RecipeFormModal
        open={recipeFormId != null}
        editId={recipeFormId === "new" ? null : recipeFormId}
        onClose={() => setRecipeFormId(null)}
      />

      <PantryFormModal
        open={pantryFormId != null}
        editId={pantryFormId === "new" ? null : pantryFormId}
        onClose={() => setPantryFormId(null)}
      />
    </div>
  );
}

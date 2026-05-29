"use client";

import { useMemo, useState } from "react";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { IconSprite } from "@/components/icons/IconSprite";
import { Sidebar } from "@/components/layout/Sidebar";
import { PantryFormModal } from "@/components/pantry/PantryFormModal";
import { PantryPage } from "@/components/pantry/PantryPage";
import { RecipeDetailModal } from "@/components/recipes/RecipeDetailModal";
import { RecipeFormModal } from "@/components/recipes/RecipeFormModal";
import { RecipesPage } from "@/components/recipes/RecipesPage";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

export function BakingApp() {
  const { tab, recipes, deleteRecipe, deletePantry } = useApp();

  const [detailId, setDetailId] = useState<number | null>(null);
  const [recipeFormId, setRecipeFormId] = useState<number | null | "new">(null);
  const [pantryFormId, setPantryFormId] = useState<number | null | "new">(null);

  const detailRecipe = useMemo(
    () => recipes.find((r) => r.id === detailId) ?? null,
    [recipes, detailId],
  );

  const openRecipe = (id: number) => setDetailId(id);
  const openRecipeForm = (id?: number) =>
    setRecipeFormId(id != null ? id : "new");
  const openPantryForm = (id?: number) =>
    setPantryFormId(id != null ? id : "new");

  const handleDeleteRecipe = (id: number) => {
    if (confirm("삭제할까요?")) deleteRecipe(id);
  };

  const handleDeletePantry = (id: number) => {
    if (confirm("삭제할까요?")) deletePantry(id);
  };

  return (
    <div className={styles.shell}>
      <IconSprite />
      <div className={styles.app}>
        <Sidebar />

        <div className={tab === "dash" ? styles.pgOn : styles.pg}>
          <DashboardPage
            onOpenRecipe={openRecipe}
            onAddRecipe={() => openRecipeForm()}
          />
        </div>

        <div className={tab === "recipes" ? styles.pgOn : styles.pg}>
          <RecipesPage
            onOpenRecipe={openRecipe}
            onAddRecipe={() => openRecipeForm()}
            onEditRecipe={(id) => openRecipeForm(id)}
            onDeleteRecipe={handleDeleteRecipe}
          />
        </div>

        <div className={tab === "pantry" ? styles.pgOn : styles.pg}>
          <PantryPage
            onAddItem={() => openPantryForm()}
            onEditItem={(id) => openPantryForm(id)}
            onDeleteItem={handleDeletePantry}
          />
        </div>

        <RecipeDetailModal
          recipe={detailRecipe}
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
    </div>
  );
}

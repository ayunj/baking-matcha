"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_PANTRY, INITIAL_RECIPES } from "@/data/mock-data";
import type { PantryItem } from "@/types/pantry";
import type { Recipe } from "@/types/recipe";

export type TabId = "dash" | "recipes" | "pantry";

type AppContextValue = {
  tab: TabId;
  setTab: (tab: TabId) => void;
  recipes: Recipe[];
  pantry: PantryItem[];
  saveRecipe: (data: Omit<Recipe, "id" | "createdAt">, editId?: number | null) => void;
  deleteRecipe: (id: number) => void;
  savePantry: (data: Omit<PantryItem, "id">, editId?: number | null) => void;
  deletePantry: (id: number) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabId>("dash");
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [pantry, setPantry] = useState<PantryItem[]>(INITIAL_PANTRY);

  const saveRecipe = useCallback(
    (data: Omit<Recipe, "id" | "createdAt">, editId?: number | null) => {
      if (editId != null) {
        setRecipes((prev) =>
          prev.map((r) => (r.id === editId ? { ...r, ...data } : r)),
        );
      } else {
        setRecipes((prev) => [
          { id: Date.now(), createdAt: Date.now(), ...data },
          ...prev,
        ]);
      }
    },
    [],
  );

  const deleteRecipe = useCallback((id: number) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const savePantry = useCallback(
    (data: Omit<PantryItem, "id">, editId?: number | null) => {
      if (editId != null) {
        setPantry((prev) =>
          prev.map((i) => (i.id === editId ? { ...i, ...data } : i)),
        );
      } else {
        setPantry((prev) => [{ id: Date.now(), ...data }, ...prev]);
      }
    },
    [],
  );

  const deletePantry = useCallback((id: number) => {
    setPantry((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      tab,
      setTab,
      recipes,
      pantry,
      saveRecipe,
      deleteRecipe,
      savePantry,
      deletePantry,
    }),
    [tab, recipes, pantry, saveRecipe, deleteRecipe, savePantry, deletePantry],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

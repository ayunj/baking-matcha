"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_SECTION_DATA,
  INITIAL_USERS,
  type AppUser,
  type SectionData,
} from "@/data/mock-data";
import { useSupabase } from "@/context/SupabaseContext";
import { loadAllSectionData } from "@/lib/supabase/load-section-data";
import {
  createPantryItem,
  deletePantryItem,
  updatePantryItem,
} from "@/lib/supabase/repositories/pantry-repository";
import {
  createRecipe,
  deleteRecipe as deleteRecipeDb,
  updateRecipe as updateRecipeDb,
} from "@/lib/supabase/repositories/recipes-repository";
import {
  createUser,
  isUsernameTaken,
  loginUser,
} from "@/lib/supabase/repositories/users-repository";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/lib/supabase/session";
import type { PantryItem } from "@/types/pantry";
import type { Recipe } from "@/types/recipe";
import {
  SECTIONS,
  type SectionConfig,
  type SectionId,
} from "@/types/section";

export type ScreenId = "auth" | "home" | "section";
export type TabId = "dash" | "recipes" | "pantry";

type AppContextValue = {
  screen: ScreenId;
  user: AppUser | null;
  section: SectionId;
  sectionConfig: SectionConfig;
  tab: TabId;
  setTab: (tab: TabId) => void;
  recipes: Recipe[];
  pantry: PantryItem[];
  sectionData: Record<SectionId, SectionData>;
  dataLoading: boolean;
  useDatabase: boolean;
  login: (id: string, pw: string) => Promise<string | null>;
  signup: (name: string, id: string, pw: string) => Promise<string | null>;
  logout: () => void;
  goHome: () => void;
  goSection: (section: SectionId) => void;
  saveRecipe: (
    data: Omit<Recipe, "id" | "createdAt">,
    editId?: string | null,
  ) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  savePantry: (
    data: Omit<PantryItem, "id">,
    editId?: string | null,
  ) => Promise<void>;
  deletePantry: (id: string) => Promise<void>;
  isUsernameTaken: (id: string) => Promise<boolean>;
};

const AppContext = createContext<AppContextValue | null>(null);

function newMockId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { client, tablesReady, status } = useSupabase();
  const useDatabase = tablesReady && client != null;

  const [screen, setScreen] = useState<ScreenId>("auth");
  const [user, setUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [section, setSection] = useState<SectionId>("baking");
  const [tab, setTab] = useState<TabId>("dash");
  const [sectionData, setSectionData] =
    useState<Record<SectionId, SectionData>>(INITIAL_SECTION_DATA);
  const [dataLoading, setDataLoading] = useState(false);

  const sectionConfig = SECTIONS[section];
  const recipes = sectionData[section].recipes;
  const pantry = sectionData[section].pantry;

  const updateSection = useCallback(
    (updater: (prev: SectionData) => SectionData) => {
      setSectionData((all) => ({
        ...all,
        [section]: updater(all[section]),
      }));
    },
    [section],
  );

  const hydrateFromDb = useCallback(
    async (dbUser: AppUser) => {
      if (!client || !dbUser.dbId) return;
      setDataLoading(true);
      try {
        const data = await loadAllSectionData(client, dbUser.dbId);
        setSectionData(data);
      } finally {
        setDataLoading(false);
      }
    },
    [client],
  );

  useEffect(() => {
    if (!useDatabase || !client || status === "checking") return;

    const session = loadSession();
    if (!session) return;

    let cancelled = false;
    (async () => {
      setDataLoading(true);
      try {
        const restored: AppUser = {
          id: session.id,
          dbId: session.dbId,
          name: session.name,
        };
        if (cancelled) return;
        setUser(restored);
        const data = await loadAllSectionData(client, session.dbId);
        if (cancelled) return;
        setSectionData(data);
        setScreen("home");
      } catch {
        clearSession();
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useDatabase, client, status]);

  const login = useCallback(
    async (id: string, pw: string) => {
      const username = id.trim();
      if (!username) return "아이디를 입력해주세요.";

      if (useDatabase && client) {
        try {
          const found = await loginUser(client, username, pw);
          if (!found) return "아이디 또는 비밀번호가 틀렸어요.";
          setUser(found);
          saveSession({
            id: found.id,
            dbId: found.dbId!,
            name: found.name,
          });
          await hydrateFromDb(found);
          setScreen("home");
          return null;
        } catch (e) {
          return e instanceof Error ? e.message : "로그인에 실패했어요.";
        }
      }

      const found = users.find((u) => u.id === username && u.pw === pw);
      if (!found) return "아이디 또는 비밀번호가 틀렸어요.";
      setUser(found);
      setScreen("home");
      return null;
    },
    [useDatabase, client, users, hydrateFromDb],
  );

  const signup = useCallback(
    async (name: string, id: string, pw: string) => {
      const username = id.trim();
      if (useDatabase && client) {
        try {
          if (await isUsernameTaken(client, username)) {
            return "이미 사용 중인 아이디예요.";
          }
          await createUser(client, name.trim(), username, pw);
          return null;
        } catch (e) {
          return e instanceof Error ? e.message : "가입에 실패했어요.";
        }
      }

      if (users.some((u) => u.id === username)) {
        return "이미 사용 중인 아이디예요.";
      }
      setUsers((prev) => [...prev, { id: username, pw, name: name.trim() }]);
      return null;
    },
    [useDatabase, client, users],
  );

  const checkUsernameTaken = useCallback(
    async (username: string) => {
      const id = username.trim();
      if (!id) return false;
      if (useDatabase && client) {
        return isUsernameTaken(client, id);
      }
      return users.some((u) => u.id === id);
    },
    [useDatabase, client, users],
  );

  const logout = useCallback(() => {
    setUser(null);
    setScreen("auth");
    setTab("dash");
    clearSession();
    if (!useDatabase) {
      setSectionData(INITIAL_SECTION_DATA);
    } else {
      setSectionData({
        baking: { recipes: [], pantry: [] },
        food: { recipes: [], pantry: [] },
        drink: { recipes: [], pantry: [] },
      });
    }
  }, [useDatabase]);

  const goHome = useCallback(() => {
    setScreen("home");
    setTab("dash");
  }, []);

  const goSection = useCallback((next: SectionId) => {
    setSection(next);
    setTab("dash");
    setScreen("section");
  }, []);

  const saveRecipe = useCallback(
    async (data: Omit<Recipe, "id" | "createdAt">, editId?: string | null) => {
      if (useDatabase && client && user?.dbId) {
        if (editId != null) {
          const updated = await updateRecipeDb(
            client,
            user.dbId,
            section,
            editId,
            data,
          );
          updateSection((prev) => ({
            ...prev,
            recipes: prev.recipes.map((r) =>
              r.id === editId ? updated : r,
            ),
          }));
        } else {
          const created = await createRecipe(
            client,
            user.dbId,
            section,
            data,
          );
          updateSection((prev) => ({
            ...prev,
            recipes: [created, ...prev.recipes],
          }));
        }
        return;
      }

      updateSection((prev) => {
        if (editId != null) {
          return {
            ...prev,
            recipes: prev.recipes.map((r) =>
              r.id === editId ? { ...r, ...data } : r,
            ),
          };
        }
        return {
          ...prev,
          recipes: [
            { id: newMockId(), createdAt: Date.now(), ...data },
            ...prev.recipes,
          ],
        };
      });
    },
    [useDatabase, client, user, section, updateSection],
  );

  const deleteRecipe = useCallback(
    async (id: string) => {
      if (useDatabase && client) {
        await deleteRecipeDb(client, id);
      }
      updateSection((prev) => ({
        ...prev,
        recipes: prev.recipes.filter((r) => r.id !== id),
      }));
    },
    [useDatabase, client, updateSection],
  );

  const savePantry = useCallback(
    async (data: Omit<PantryItem, "id">, editId?: string | null) => {
      if (useDatabase && client && user?.dbId) {
        if (editId != null) {
          const updated = await updatePantryItem(client, editId, data);
          updateSection((prev) => ({
            ...prev,
            pantry: prev.pantry.map((i) =>
              i.id === editId ? updated : i,
            ),
          }));
        } else {
          const created = await createPantryItem(
            client,
            user.dbId,
            section,
            data,
          );
          updateSection((prev) => ({
            ...prev,
            pantry: [created, ...prev.pantry],
          }));
        }
        return;
      }

      updateSection((prev) => {
        if (editId != null) {
          return {
            ...prev,
            pantry: prev.pantry.map((i) =>
              i.id === editId ? { ...i, ...data } : i,
            ),
          };
        }
        return {
          ...prev,
          pantry: [{ id: newMockId(), ...data }, ...prev.pantry],
        };
      });
    },
    [useDatabase, client, user, section, updateSection],
  );

  const deletePantry = useCallback(
    async (id: string) => {
      if (useDatabase && client) {
        await deletePantryItem(client, id);
      }
      updateSection((prev) => ({
        ...prev,
        pantry: prev.pantry.filter((i) => i.id !== id),
      }));
    },
    [useDatabase, client, updateSection],
  );

  const value = useMemo(
    () => ({
      screen,
      user,
      section,
      sectionConfig,
      tab,
      setTab,
      recipes,
      pantry,
      sectionData,
      dataLoading,
      useDatabase,
      login,
      signup,
      logout,
      goHome,
      goSection,
      saveRecipe,
      deleteRecipe,
      savePantry,
      deletePantry,
      isUsernameTaken: checkUsernameTaken,
    }),
    [
      screen,
      user,
      section,
      sectionConfig,
      tab,
      recipes,
      pantry,
      sectionData,
      dataLoading,
      useDatabase,
      login,
      signup,
      logout,
      goHome,
      goSection,
      saveRecipe,
      deleteRecipe,
      savePantry,
      deletePantry,
      checkUsernameTaken,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

type RecipesPageProps = {
  onOpenRecipe: (id: number) => void;
  onAddRecipe: () => void;
  onEditRecipe: (id: number) => void;
  onDeleteRecipe: (id: number) => void;
};

export function RecipesPage({
  onOpenRecipe,
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
}: RecipesPageProps) {
  const { recipes } = useApp();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"new" | "name">("new");
  const [catF, setCatF] = useState("전체");

  const cats = useMemo(
    () => ["전체", ...new Set(recipes.map((r) => r.cat))],
    [recipes],
  );

  const list = useMemo(() => {
    const q = search.toLowerCase();
    let filtered = recipes.filter(
      (r) =>
        (catF === "전체" || r.cat === catF) &&
        (!q || r.name.toLowerCase().includes(q)),
    );
    if (sort === "name") {
      filtered = [...filtered].sort((a, b) =>
        a.name.localeCompare(b.name, "ko"),
      );
    } else {
      filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    }
    return filtered;
  }, [recipes, search, sort, catF]);

  return (
    <>
      <div className={styles.ptitle}>레시피</div>
      <div className={styles.psub}>총 {recipes.length}개의 레시피</div>

      <div className={styles.tbar}>
        <input
          type="text"
          placeholder="레시피 이름 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as "new" | "name")}>
          <option value="new">최신순</option>
          <option value="name">이름순</option>
        </select>
      </div>

      <div className={styles.frow}>
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={catF === c ? styles.ftagOn : styles.ftag}
            onClick={() => setCatF(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={styles.rgrid}>
        {list.map((r) => (
          <div
            key={r.id}
            className={styles.rcard}
            role="button"
            tabIndex={0}
            onClick={() => onOpenRecipe(r.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onOpenRecipe(r.id);
            }}
          >
            <div className={styles.rcardActs}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRecipe(r.id);
                }}
              >
                <Icon id="ic-edit" />
              </IconButton>
              <IconButton
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRecipe(r.id);
                }}
              >
                <Icon id="ic-trash" />
              </IconButton>
            </div>
            <div className={styles.rcardEm}>{r.emoji}</div>
            <div className={styles.rcardNm}>{r.name}</div>
            <div className={styles.rcardMt}>{r.serving}</div>
            <span className={styles.rpill}>{r.cat}</span>
          </div>
        ))}
        <button type="button" className={`${styles.rcard} ${styles.addcard}`} onClick={onAddRecipe}>
          <Icon id="ic-plus" size={22} />
          <span>새 레시피</span>
        </button>
      </div>
    </>
  );
}

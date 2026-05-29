"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

type RecipesPageProps = {
  onOpenRecipe: (id: string) => void;
  onAddRecipe: () => void;
  onEditRecipe: (id: string) => void;
  onDeleteRecipe: (id: string) => void;
};

export function RecipesPage({
  onOpenRecipe,
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
}: RecipesPageProps) {
  const { recipes } = useApp();
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("전체");

  const cats = useMemo(
    () => ["전체", ...new Set(recipes.map((r) => r.cat))],
    [recipes],
  );

  const list = useMemo(() => {
    const q = search.toLowerCase();
    return recipes.filter(
      (r) =>
        (catF === "전체" || r.cat === catF) &&
        (!q || r.name.toLowerCase().includes(q)),
    );
  }, [recipes, search, catF]);

  return (
    <>
      <div className={styles.tbar}>
        <input
          type="text"
          placeholder="레시피 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
        <button
          type="button"
          className={`${styles.rcard} ${styles.addcard}`}
          onClick={onAddRecipe}
        >
          <Icon id="ic-plus" size={20} />
          <span>새 레시피</span>
        </button>
      </div>
    </>
  );
}

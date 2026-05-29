"use client";

import { Icon } from "@/components/icons/Icon";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

type DashboardPageProps = {
  onOpenRecipe: (id: number) => void;
  onAddRecipe: () => void;
};

export function DashboardPage({ onOpenRecipe, onAddRecipe }: DashboardPageProps) {
  const { recipes, pantry } = useApp();
  const low = pantry.filter((i) => i.low).length;
  const recent = [...recipes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);

  return (
    <>
      <div className={styles.ptitle}>융융의 베이킹노트</div>
      <div className={styles.psub}>오늘도 맛있게 구워봐요 🍵</div>

      <div className={styles.sgrid}>
        <div className={styles.sc}>
          <div className={styles.sl}>레시피</div>
          <div className={styles.sv}>{recipes.length}</div>
        </div>
        <div className={styles.sc}>
          <div className={styles.sl}>재료 종류</div>
          <div className={styles.sv}>{pantry.length}</div>
        </div>
        <div className={styles.sc}>
          <div className={styles.sl}>재고 부족</div>
          <div className={low ? styles.svWarn : styles.sv}>{low}</div>
        </div>
      </div>

      <div className={styles.sechd}>
        <span className={styles.seclabel}>최근 레시피</span>
        <button type="button" className={styles.fab} onClick={onAddRecipe}>
          <Icon id="ic-plus" size={14} />
          레시피 추가
        </button>
      </div>

      <div className={styles.rlist}>
        {recent.length === 0 ? (
          <div className={styles.empty}>아직 레시피가 없어요</div>
        ) : (
          recent.map((r) => (
            <button
              key={r.id}
              type="button"
              className={styles.ri}
              onClick={() => onOpenRecipe(r.id)}
            >
              <div className={styles.remoji}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div className={styles.rname}>{r.name}</div>
                <div className={styles.rmeta}>
                  {r.cat}
                  {r.serving ? ` · ${r.serving}` : ""}
                </div>
              </div>
              <Icon id="ic-chevron" className={styles.chevron} />
            </button>
          ))
        )}
      </div>
    </>
  );
}

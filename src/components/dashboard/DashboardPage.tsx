"use client";

import { Icon } from "@/components/icons/Icon";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

type DashboardPageProps = {
  onOpenRecipe: (id: string) => void;
  onAddRecipe: () => void;
};

export function DashboardPage({ onOpenRecipe, onAddRecipe }: DashboardPageProps) {
  const { user, recipes, pantry, sectionConfig } = useApp();
  const low = pantry.filter((i) => i.low).length;
  const recent = [...recipes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  return (
    <>
      <div className={styles.pgTitle}>
        {user ? `${user.name}님의 ` : ""}
        {sectionConfig.title}
      </div>
      <div className={styles.pgSub}>{sectionConfig.desc}</div>

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
          <Icon id="ic-plus" size={12} />
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
              <div style={{ flex: 1, minWidth: 0 }}>
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

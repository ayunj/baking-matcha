"use client";

import { Icon } from "@/components/icons/Icon";
import { DbConnectionStatus } from "@/components/layout/DbConnectionStatus";
import { useApp } from "@/context/AppContext";
import { HOME_CATEGORIES } from "@/types/section";
import styles from "@/styles/app.module.css";

export function HomeScreen() {
  const { user, sectionData, goSection, logout, dataLoading, useDatabase } =
    useApp();

  return (
    <div className={styles.homeOuter}>
      <div className={styles.homeInner}>
        <div className={styles.homeTop}>
          <div>
            <h2>
              {user ? `${user.name}님의 레시피 노트` : "나의 레시피 노트"}
            </h2>
            <p>오늘도 맛있게 구워봐요 🍵</p>
          </div>
          <div className={styles.homeTopActions}>
            <DbConnectionStatus />
            <button type="button" className={styles.logoutBtn} onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>

        {useDatabase && dataLoading ? (
          <p className={styles.pgSub}>데이터 불러오는 중…</p>
        ) : null}

        <div className={styles.catGrid}>
          {HOME_CATEGORIES.map((cat) => {
            const data = sectionData[cat.id];
            const iconClass =
              cat.iconClass === "ciBaking"
                ? styles.ciBaking
                : cat.iconClass === "ciFood"
                  ? styles.ciFood
                  : styles.ciDrink;

            return (
              <button
                key={cat.id}
                type="button"
                className={styles.catCard}
                onClick={() => goSection(cat.id)}
              >
                <div className={`${styles.catIcon} ${iconClass}`}>
                  {cat.icon}
                </div>
                <div className={styles.catInfo}>
                  <div className={styles.catTitle}>{cat.title}</div>
                  <div className={styles.catDesc}>{cat.desc}</div>
                  <div className={styles.catCnt}>
                    레시피 {data.recipes.length}개 · 재료{" "}
                    {data.pantry.length}종
                  </div>
                </div>
                <div className={styles.catArr}>
                  <Icon id="ic-chevron" className={styles.chevron} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

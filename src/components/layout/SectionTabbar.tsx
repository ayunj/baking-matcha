"use client";

import { Icon } from "@/components/icons/Icon";
import { useApp, type TabId } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "dash", label: "대시보드", icon: "ic-dash" },
  { id: "recipes", label: "레시피", icon: "ic-book" },
  { id: "pantry", label: "재료 창고", icon: "ic-basket" },
];

export function SectionTabbar() {
  const { tab, setTab, goHome, sectionConfig } = useApp();

  return (
    <div className={styles.secTabbar}>
      <div className={styles.secTabbarInner}>
        <button
          type="button"
          className={styles.secBack}
          onClick={goHome}
          aria-label="홈으로"
        >
          <Icon id="ic-al" size={13} />
        </button>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? styles.stabOn : styles.stab}
            onClick={() => setTab(t.id)}
          >
            <Icon id={t.icon} size={13} />
            {t.label}
          </button>
        ))}
        <span className={styles.secIcon}>{sectionConfig.icon}</span>
      </div>
    </div>
  );
}

"use client";

import { Icon } from "@/components/icons/Icon";
import { useApp, type TabId } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "dash", label: "대시보드", icon: "ic-dash" },
  { id: "recipes", label: "레시피", icon: "ic-book" },
  { id: "pantry", label: "재료 창고", icon: "ic-basket" },
];

export function Sidebar() {
  const { tab, setTab } = useApp();

  return (
    <nav className={styles.sidebar}>
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={tab === t.id ? styles.nbtnOn : styles.nbtn}
          onClick={() => setTab(t.id)}
        >
          <Icon id={t.icon} size={15} />
          <span className={styles.nbtnLabel}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

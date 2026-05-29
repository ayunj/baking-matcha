"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

type PantryPageProps = {
  onAddItem: () => void;
  onEditItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

export function PantryPage({ onAddItem, onEditItem, onDeleteItem }: PantryPageProps) {
  const { pantry } = useApp();
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("전체");

  const cats = useMemo(
    () => ["전체", ...new Set(pantry.map((i) => i.cat))],
    [pantry],
  );

  const list = useMemo(() => {
    const q = search.toLowerCase();
    return pantry.filter(
      (i) =>
        (catF === "전체" || i.cat === catF) &&
        (!q || i.name.toLowerCase().includes(q)),
    );
  }, [pantry, search, catF]);

  const lowCount = pantry.filter((i) => i.low).length;

  return (
    <>
      <div className={styles.ptitle}>재료 창고</div>
      <div className={styles.psub}>
        보유 {pantry.length}종 · 부족 {lowCount}종
      </div>

      <div className={styles.tbar}>
        <input
          type="text"
          placeholder="재료 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={catF} onChange={(e) => setCatF(e.target.value)}>
          {cats.map((c) => (
            <option key={c} value={c}>
              {c === "전체" ? "전체 카테고리" : c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.sechd} style={{ marginBottom: 12 }}>
        <span className={styles.seclabel}>총 {pantry.length}종</span>
        <button type="button" className={styles.fab} onClick={onAddItem}>
          <Icon id="ic-plus" size={14} />
          재료 추가
        </button>
      </div>

      <div className={styles.igrid}>
        {list.map((i) => (
          <div key={i.id} className={styles.iitem}>
            <div className={styles.iacts}>
              <IconButton onClick={() => onEditItem(i.id)}>
                <Icon id="ic-edit" />
              </IconButton>
              <IconButton danger onClick={() => onDeleteItem(i.id)}>
                <Icon id="ic-trash" />
              </IconButton>
            </div>
            <div className={styles.inm}>{i.name}</div>
            <div className={styles.iqt}>{i.qty}</div>
            <div>
              <span className={styles.icpill}>{i.cat}</span>
              {i.low && <span className={styles.lowbadge}>부족</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

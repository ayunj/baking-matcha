"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppContext";
import { PANTRY_CATEGORIES } from "@/types/pantry";
import styles from "@/styles/app.module.css";

type PantryFormModalProps = {
  open: boolean;
  editId: number | null;
  onClose: () => void;
};

export function PantryFormModal({ open, editId, onClose }: PantryFormModalProps) {
  const { pantry, savePantry } = useApp();
  const editing = editId != null ? pantry.find((i) => i.id === editId) : null;

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [cat, setCat] = useState<string>(PANTRY_CATEGORIES[0]);
  const [low, setLow] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setQty(editing.qty);
      setCat(editing.cat);
      setLow(editing.low);
    } else {
      setName("");
      setQty("");
      setCat(PANTRY_CATEGORIES[0]);
      setLow(false);
    }
  }, [open, editing]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    savePantry(
      { name: trimmed, qty: qty.trim(), cat, low },
      editId,
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.mhd}>
          <h2>{editId != null ? "재료 수정" : "재료 추가"}</h2>
        </div>
        <div className={styles.mbody}>
          <div className={styles.fr}>
            <label>재료명</label>
            <input
              className={styles.finput}
              type="text"
              placeholder="예: 박력분"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.row2}>
            <div className={styles.fr}>
              <label>수량 / 용량</label>
              <input
                className={styles.finput}
                type="text"
                placeholder="예: 500g"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
            <div className={styles.fr}>
              <label>카테고리</label>
              <select
                className={styles.fselect}
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                {PANTRY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.fr}>
            <label className={styles.chkLabel}>
              <input
                type="checkbox"
                checked={low}
                onChange={(e) => setLow(e.target.checked)}
              />
              재고 부족 표시
            </label>
          </div>
        </div>
        <div className={styles.mfoot}>
          <button type="button" className={styles.bcnl} onClick={onClose}>
            취소
          </button>
          <button type="button" className={styles.bsave} onClick={handleSave}>
            저장하기
          </button>
        </div>
      </div>
    </Modal>
  );
}

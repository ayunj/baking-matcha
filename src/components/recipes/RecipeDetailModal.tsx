"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { Modal } from "@/components/ui/Modal";
import {
  ingNameOnly,
  parseIng,
  scaleText,
} from "@/lib/ingredient-scale";
import type { Recipe } from "@/types/recipe";
import styles from "@/styles/app.module.css";

type RecipeDetailModalProps = {
  recipe: Recipe | null;
  showOven: boolean;
  open: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
};

export function RecipeDetailModal({
  recipe,
  showOven,
  open,
  onClose,
  onEdit,
}: RecipeDetailModalProps) {
  const [mult, setMult] = useState(1);

  useEffect(() => {
    setMult(1);
  }, [recipe?.id, open]);

  if (!recipe) return null;

  const serving =
    mult > 1 ? scaleText(recipe.serving, mult) : recipe.serving;

  const hasOven =
    showOven && (recipe.preheat || recipe.bakeTemp || recipe.bakeTime);

  const changeMult = (delta: number) => {
    setMult((m) => Math.max(1, m + delta));
  };

  const handleClose = () => {
    setMult(1);
    onClose();
  };

  const handleEdit = () => {
    handleClose();
    onEdit(recipe.id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={styles.modal}>
        <div className={styles.mhd}>
          <div className={styles.detailEmoji}>{recipe.emoji}</div>
          <h2 className={styles.detailTitle}>{recipe.name}</h2>
          <div className={styles.detailMeta}>
            {recipe.cat} · {serving}
          </div>
        </div>

        <div className={styles.mbody}>
          {hasOven ? (
            <div className={styles.dsec}>
              <h3>오븐 설정</h3>
              <div className={styles.ovchips}>
                {recipe.preheat ? (
                  <div className={styles.ovchip}>
                    <span>예열</span>
                    {recipe.preheat}°C
                  </div>
                ) : null}
                {recipe.bakeTemp ? (
                  <div className={styles.ovchip}>
                    <span>굽는 온도</span>
                    {recipe.bakeTemp}°C
                  </div>
                ) : null}
                {recipe.bakeTime ? (
                  <div className={styles.ovchip}>
                    <span>굽는 시간</span>
                    {recipe.bakeTime}분
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {recipe.ingredients.length > 0 ? (
            <div className={styles.dsec}>
              <div className={styles.ingSecHd}>
                <h3>재료</h3>
                <div className={styles.stepperRow}>
                  <span className={styles.stpLbl}>배수</span>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stpBtn}
                      disabled={mult <= 1}
                      onClick={() => changeMult(-1)}
                    >
                      −
                    </button>
                    <span className={styles.stpVal}>{mult}</span>
                    <button
                      type="button"
                      className={styles.stpBtn}
                      onClick={() => changeMult(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {recipe.ingredients.map((ing) => {
                const parts = parseIng(ing);
                const hasNum = parts.some((p) => p.type === "num");
                const nameOnly = ingNameOnly(ing);
                let nums: React.ReactNode;
                if (!hasNum || mult === 1) {
                  nums = <span className={styles.numBase}>{ing}</span>;
                } else {
                  nums = (
                    <>
                      <span className={styles.numOrig}>{ing}</span>
                      <span className={styles.numArr}>→</span>
                      <span className={styles.numScaled}>
                        {scaleText(ing, mult)}
                      </span>
                    </>
                  );
                }
                return (
                  <div key={ing} className={styles.ingRow}>
                    <span className={styles.ingDot}>·</span>
                    <span className={styles.ingName}>{nameOnly}</span>
                    <span className={styles.ingNums}>{nums}</span>
                  </div>
                );
              })}
            </div>
          ) : null}

          {recipe.steps.length > 0 ? (
            <div className={styles.dsec}>
              <h3>만드는 방법</h3>
              <ol className={styles.stplist}>
                {recipe.steps.map((s, idx) => (
                  <li key={idx}>
                    <div className={styles.stptxt}>{s.text}</div>
                    {s.memo ? (
                      <div className={styles.stpmemo}>
                        <Icon id="ic-note" size={12} />
                        <span>{s.memo}</span>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {recipe.note ? (
            <div className={styles.dsec}>
              <div className={styles.notebox}>
                <Icon id="ic-bulb" size={14} />
                <span>{recipe.note}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.mfoot}>
          <button type="button" className={styles.bcnl} onClick={handleClose}>
            닫기
          </button>
          <button type="button" className={styles.bsave} onClick={handleEdit}>
            수정하기
          </button>
        </div>
      </div>
    </Modal>
  );
}

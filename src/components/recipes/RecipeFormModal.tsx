"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { EMOJIS } from "@/data/mock-data";
import { useApp } from "@/context/AppContext";
import {
  PRESET_RECIPE_CATS,
  RECIPE_CATEGORIES,
  type Recipe,
  type RecipeStep,
} from "@/types/recipe";
import styles from "@/styles/app.module.css";

type RecipeFormModalProps = {
  open: boolean;
  editId: number | null;
  onClose: () => void;
};

type StepRow = { text: string; memo: string };

export function RecipeFormModal({ open, editId, onClose }: RecipeFormModalProps) {
  const { recipes, saveRecipe } = useApp();
  const editing = editId != null ? recipes.find((r) => r.id === editId) : null;

  const [emoji, setEmoji] = useState("🍰");
  const [name, setName] = useState("");
  const [cat, setCat] = useState<string>(RECIPE_CATEGORIES[0]);
  const [catCustom, setCatCustom] = useState("");
  const [serving, setServing] = useState("");
  const [preheat, setPreheat] = useState("");
  const [bakeTemp, setBakeTemp] = useState("");
  const [bakeTime, setBakeTime] = useState("");
  const [note, setNote] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<StepRow[]>([{ text: "", memo: "" }]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setEmoji(editing.emoji);
      setName(editing.name);
      setServing(editing.serving || "");
      setPreheat(editing.preheat?.toString() ?? "");
      setBakeTemp(editing.bakeTemp?.toString() ?? "");
      setBakeTime(editing.bakeTime?.toString() ?? "");
      setNote(editing.note || "");
      const isCustom = !PRESET_RECIPE_CATS.includes(
        editing.cat as (typeof PRESET_RECIPE_CATS)[number],
      );
      if (isCustom) {
        setCat("기타");
        setCatCustom(editing.cat);
      } else {
        setCat(editing.cat);
        setCatCustom("");
      }
      setIngredients(
        editing.ingredients.length ? editing.ingredients : [""],
      );
      setSteps(
        editing.steps.length
          ? editing.steps.map((s) => ({ text: s.text, memo: s.memo }))
          : [{ text: "", memo: "" }],
      );
    } else {
      setEmoji("🍰");
      setName("");
      setCat(RECIPE_CATEGORIES[0]);
      setCatCustom("");
      setServing("");
      setPreheat("");
      setBakeTemp("");
      setBakeTime("");
      setNote("");
      setIngredients([""]);
      setSteps([{ text: "", memo: "" }]);
    }
  }, [open, editing]);

  const resolvedCat =
    cat === "기타" ? catCustom.trim() || "기타" : cat;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const ings = ingredients.map((i) => i.trim()).filter(Boolean);
    const stepData: RecipeStep[] = steps
      .map((s) => ({ text: s.text.trim(), memo: s.memo.trim() }))
      .filter((s) => s.text);

    const payload: Omit<Recipe, "id" | "createdAt"> = {
      emoji,
      name: trimmed,
      cat: resolvedCat,
      serving,
      preheat: parseInt(preheat, 10) || null,
      bakeTemp: parseInt(bakeTemp, 10) || null,
      bakeTime: parseInt(bakeTime, 10) || null,
      ingredients: ings,
      steps: stepData,
      note: note.trim(),
    };

    saveRecipe(payload, editId);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.mhd}>
          <h2>{editId != null ? "레시피 수정" : "새 레시피"}</h2>
        </div>
        <div className={styles.mbody}>
          <div className={styles.fr}>
            <label>이모지</label>
            <div className={styles.emrow}>
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={emoji === e ? styles.eoSel : styles.eo}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fr}>
            <label>레시피 이름</label>
            <input
              className={styles.finput}
              type="text"
              placeholder="예: 촉촉한 초코 브라우니"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.fr}>
              <label>카테고리</label>
              <select
                className={styles.fselect}
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                {RECIPE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {cat === "기타" ? (
              <div className={styles.fr}>
                <label>직접 입력</label>
                <input
                  className={styles.finput}
                  type="text"
                  placeholder="예: 마카롱"
                  value={catCustom}
                  onChange={(e) => setCatCustom(e.target.value)}
                />
              </div>
            ) : (
              <div className={styles.fr}>
                <label>분량</label>
                <input
                  className={styles.finput}
                  type="text"
                  placeholder="예: 12개 / 8인분"
                  value={serving}
                  onChange={(e) => setServing(e.target.value)}
                />
              </div>
            )}
          </div>

          {cat === "기타" ? (
            <div className={styles.fr}>
              <label>분량</label>
              <input
                className={styles.finput}
                type="text"
                placeholder="예: 12개 / 8인분"
                value={serving}
                onChange={(e) => setServing(e.target.value)}
              />
            </div>
          ) : null}

          <div className={styles.fr}>
            <label>오븐 설정</label>
            <div className={styles.ovcols}>
              <div>
                <span className={styles.flbl} style={{ marginBottom: 4 }}>
                  예열 (°C)
                </span>
                <input
                  className={styles.finput}
                  type="number"
                  placeholder="175"
                  value={preheat}
                  onChange={(e) => setPreheat(e.target.value)}
                />
              </div>
              <div>
                <span className={styles.flbl} style={{ marginBottom: 4 }}>
                  굽는 온도 (°C)
                </span>
                <input
                  className={styles.finput}
                  type="number"
                  placeholder="180"
                  value={bakeTemp}
                  onChange={(e) => setBakeTemp(e.target.value)}
                />
              </div>
              <div>
                <span className={styles.flbl} style={{ marginBottom: 4 }}>
                  굽는 시간 (분)
                </span>
                <input
                  className={styles.finput}
                  type="number"
                  placeholder="25"
                  value={bakeTime}
                  onChange={(e) => setBakeTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.fr}>
            <div className={styles.flblrow}>
              <span className={styles.flbl} style={{ margin: 0 }}>
                재료
              </span>
            </div>
            <div className={styles.dynlist}>
              {ingredients.map((val, idx) => (
                <div key={idx} className={styles.dynrow}>
                  <input
                    className={styles.finputFlex}
                    type="text"
                    placeholder="예: 박력분 200g"
                    value={val}
                    onChange={(e) => {
                      const next = [...ingredients];
                      next[idx] = e.target.value;
                      setIngredients(next);
                    }}
                  />
                  <IconButton
                    danger
                    onClick={() =>
                      setIngredients(ingredients.filter((_, i) => i !== idx))
                    }
                  >
                    <Icon id="ic-trash" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addpill}
              onClick={() => setIngredients([...ingredients, ""])}
            >
              <Icon id="ic-plus" size={13} />
              재료 추가
            </button>
          </div>

          <div className={styles.fr} style={{ marginTop: 4 }}>
            <div className={styles.flblrow}>
              <span className={styles.flbl} style={{ margin: 0 }}>
                만드는 방법
              </span>
            </div>
            <div className={styles.dynlist}>
              {steps.map((step, idx) => (
                <div key={idx} className={styles.dynrow}>
                  <span className={styles.stepnum}>{idx + 1}</span>
                  <div className={styles.dyninner}>
                    <input
                      className={styles.finput}
                      type="text"
                      placeholder="단계 설명"
                      value={step.text}
                      onChange={(e) => {
                        const next = [...steps];
                        next[idx] = { ...next[idx], text: e.target.value };
                        setSteps(next);
                      }}
                    />
                    <textarea
                      className={styles.memoinput}
                      placeholder="이 단계 메모 (선택)"
                      value={step.memo}
                      onChange={(e) => {
                        const next = [...steps];
                        next[idx] = { ...next[idx], memo: e.target.value };
                        setSteps(next);
                      }}
                    />
                  </div>
                  <IconButton
                    danger
                    onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                  >
                    <Icon id="ic-trash" />
                  </IconButton>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={styles.addpill}
              onClick={() => setSteps([...steps, { text: "", memo: "" }])}
            >
              <Icon id="ic-plus" size={13} />
              단계 추가
            </button>
          </div>

          <div className={styles.fr}>
            <label>전체 메모 / 팁</label>
            <input
              className={styles.finput}
              type="text"
              placeholder="보관 방법, 변형 팁 등"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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

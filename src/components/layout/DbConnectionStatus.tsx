"use client";

import { useSupabase } from "@/context/SupabaseContext";
import styles from "@/styles/app.module.css";

const LABELS: Record<string, string> = {
  checking: "DB 확인 중…",
  connected: "DB 연결됨",
  connected_no_tables: "DB 연결됨 · 테이블 준비 필요",
  misconfigured: "DB 미설정 (.env)",
  error: "DB 연결 실패",
};

export function DbConnectionStatus() {
  const { status, errorMessage } = useSupabase();

  const tone =
    status === "connected"
      ? styles.dbOk
      : status === "connected_no_tables" || status === "checking"
        ? styles.dbPending
        : styles.dbBad;

  return (
    <div
      className={`${styles.dbStatus} ${tone}`}
      title={errorMessage ?? undefined}
    >
      <span className={styles.dbDot} aria-hidden />
      <span>{LABELS[status] ?? status}</span>
    </div>
  );
}

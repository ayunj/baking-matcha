"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { checkSupabaseConnection } from "@/lib/supabase/check-connection";
import { getSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type SupabaseConnectionStatus =
  | "idle"
  | "checking"
  | "connected"
  | "connected_no_tables"
  | "misconfigured"
  | "error";

type SupabaseContextValue = {
  client: SupabaseClient | null;
  status: SupabaseConnectionStatus;
  errorMessage: string | null;
  isConfigured: boolean;
  tablesReady: boolean;
};

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const isConfigured = isSupabaseConfigured();
  const [client, setClient] = useState<SupabaseClient | null>(null);

  const [status, setStatus] = useState<SupabaseConnectionStatus>(() =>
    isConfigured ? "checking" : "misconfigured",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tablesReady, setTablesReady] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setClient(null);
      setStatus("misconfigured");
      setErrorMessage(null);
      setTablesReady(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const supabase = await getSupabaseClient();
      if (cancelled) return;

      if (!supabase) {
        setClient(null);
        setStatus("misconfigured");
        setErrorMessage(null);
        setTablesReady(false);
        return;
      }

      setClient(supabase);
      setStatus("checking");
      setErrorMessage(null);

      const result = await checkSupabaseConnection(supabase);
      if (cancelled) return;

      if (result.ok) {
        setTablesReady(result.tablesReady);
        setStatus(result.tablesReady ? "connected" : "connected_no_tables");
        setErrorMessage(null);
      } else {
        setTablesReady(false);
        setStatus("error");
        setErrorMessage(result.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isConfigured]);

  const value = useMemo(
    () => ({
      client,
      status,
      errorMessage,
      isConfigured,
      tablesReady,
    }),
    [client, status, errorMessage, isConfigured, tablesReady],
  );

  return (
    <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return ctx;
}

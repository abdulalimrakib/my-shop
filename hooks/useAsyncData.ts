"use client";

import { useEffect, useState } from "react";

/**
 * Loads data for `key` with `fetcher` and reloads whenever `key` changes.
 * `loading` is derived (the loaded key differs from the current one), so
 * state is only set when a request settles, and a stale response can never
 * overwrite a newer one. Pass a stable `fetcher` (e.g. an imported server
 * action) and put every input it needs into `key`. A `null` key skips loading.
 */
export function useAsyncData<T>(
  key: string | null,
  fetcher: (key: string) => Promise<T>,
) {
  const [result, setResult] = useState<{ key: string; data: T | undefined }>();

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    fetcher(key)
      .then((data) => {
        if (!cancelled) setResult({ key, data });
      })
      .catch((error) => {
        console.error("Failed to load data", error);
        if (!cancelled) setResult({ key, data: undefined });
      });
    return () => {
      cancelled = true;
    };
  }, [key, fetcher]);

  const isCurrent = key !== null && result?.key === key;
  return {
    data: isCurrent ? result.data : undefined,
    loading: key !== null && !isCurrent,
  };
}

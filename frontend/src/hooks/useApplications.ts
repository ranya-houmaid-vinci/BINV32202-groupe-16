import { useCallback, useEffect, useState } from "react";
import type { Application } from "../models/application.ts";
import { getApplications } from "../services/applications.service.ts";
import { isUnauthorized } from "../utils/api.ts";

export const useApplications = (
  token: string,
  onUnauthorized: () => void,
  enabled = true,
) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(
    (signal?: AbortSignal) => {
      if (!enabled) return Promise.resolve([]);
      return getApplications(token, signal)
        .then((data) => {
          if (!signal?.aborted) setApplications(data);
          return data;
        })
        .catch((reason: unknown) => {
          if (signal?.aborted) return [];
          if (isUnauthorized(reason)) onUnauthorized();
          else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
          return [];
        })
        .finally(() => {
          if (!signal?.aborted) setIsLoading(false);
        });
    },
    [token, onUnauthorized, enabled],
  );

  useEffect(() => {
    const controller = new AbortController();
    void reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  return { applications, isLoading, error, reload };
};

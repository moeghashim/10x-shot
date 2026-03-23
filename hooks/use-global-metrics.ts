import { useEffect, useState } from "react";
import type { GlobalMetric } from "@/types/database";

export function useGlobalMetrics() {
  const [metrics, setMetrics] = useState<GlobalMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/global-metrics");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load global metrics");
      }

      setMetrics(result.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load global metrics");
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  const saveMetric = async (metric: Omit<GlobalMetric, "id" | "created_at">) => {
    try {
      const response = await fetch("/api/admin/global-metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save global metric");
      }

      await loadMetrics();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save global metric";
      setError(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    reload: loadMetrics,
    saveMetric,
  };
}

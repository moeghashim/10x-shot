import { useEffect, useState } from "react";
import type { ProjectMetric } from "@/types/database";

export function useProjectMetrics(projectId?: number) {
  const [metrics, setMetrics] = useState<ProjectMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (projectId !== undefined) {
        params.set("projectId", String(projectId));
      }

      const response = await fetch(`/api/admin/project-metrics${params.size ? `?${params}` : ""}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load metrics");
      }

      setMetrics(result.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load metrics");
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  const saveMetric = async (metric: Omit<ProjectMetric, "id" | "created_at">) => {
    try {
      const response = await fetch("/api/admin/project-metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metric),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save metric");
      }

      await loadMetrics();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save metric";
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteMetric = async (id: number) => {
    try {
      const response = await fetch("/api/admin/project-metrics", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete metric");
      }

      await loadMetrics();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete metric";
      setError(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, [projectId]);

  return {
    metrics,
    loading,
    error,
    reload: loadMetrics,
    saveMetric,
    deleteMetric,
  };
}

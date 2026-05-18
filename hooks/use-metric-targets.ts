import { useEffect, useState } from "react";
import type { ProjectMetricTarget } from "@/types/database";

export function useProjectMetricTargets(projectId?: number) {
  const [targets, setTargets] = useState<ProjectMetricTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTargets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (projectId !== undefined) {
        params.set("projectId", String(projectId));
      }

      const response = await fetch(`/api/admin/project-metric-targets${params.size ? `?${params}` : ""}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load metric targets");
      }

      setTargets(result.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load metric targets");
      setTargets([]);
    } finally {
      setLoading(false);
    }
  };

  const saveTargets = async (
    nextTargets: Omit<ProjectMetricTarget, "id" | "created_at" | "updated_at">[]
  ) => {
    try {
      const response = await fetch("/api/admin/project-metric-targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextTargets),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save metric targets");
      }

      await loadTargets();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save metric targets";
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteTarget = async (id: number) => {
    try {
      const response = await fetch("/api/admin/project-metric-targets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete metric target");
      }

      await loadTargets();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete metric target";
      setError(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    void loadTargets();
  }, [projectId]);

  return {
    targets,
    loading,
    error,
    reload: loadTargets,
    saveTargets,
    deleteTarget,
  };
}

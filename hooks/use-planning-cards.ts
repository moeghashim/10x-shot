import { useEffect, useState } from "react";
import type { PlanningCard } from "@/types/database";

export function usePlanningCards() {
  const [cards, setCards] = useState<PlanningCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/planning-cards");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load planning cards");
      }

      setCards(result.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load planning cards");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCard = async (card: PlanningCard) => {
    try {
      const response = await fetch("/api/admin/planning-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save planning card");
      }

      await loadCards();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save planning card";
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteCard = async (id: number) => {
    try {
      const response = await fetch("/api/admin/planning-cards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete planning card");
      }

      await loadCards();
      return { success: true, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete planning card";
      setError(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    void loadCards();
  }, []);

  return {
    cards,
    loading,
    error,
    reload: loadCards,
    saveCard,
    deleteCard,
  };
}

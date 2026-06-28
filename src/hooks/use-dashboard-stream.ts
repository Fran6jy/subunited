"use client";

import { useEffect } from "react";

type StreamEventHandler = (event: MessageEvent<string>) => void;

export function useDashboardStream(userId: string | null, onPurchaseActivated?: StreamEventHandler) {
  useEffect(() => {
    if (!userId) return;

    const source = new EventSource("/api/events/stream", {
      withCredentials: false,
    });

    if (onPurchaseActivated) {
      source.addEventListener("purchase.activated", onPurchaseActivated as EventListener);
      source.addEventListener("renewal.reminder", onPurchaseActivated as EventListener);
      source.addEventListener("purchase.expired", onPurchaseActivated as EventListener);
    }

    return () => {
      source.close();
    };
  }, [userId, onPurchaseActivated]);
}

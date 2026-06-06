import { useState, useEffect } from "react";
import type { TMotivationalQuote } from "~/modules/configurables/src/constants/configurables.default";

const STORAGE_KEY = "uptime_wotd_dismissed_date";

export function useWordOfDay(quotes: TMotivationalQuote[]) {
  const [showModal, setShowModal] = useState(false);
  const [todayQuote, setTodayQuote] = useState<TMotivationalQuote | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !quotes || quotes.length === 0) return;

    const today = new Date().toDateString();
    const lastDismissed = localStorage.getItem(STORAGE_KEY);

    // Pick a quote based on day-of-year so it's consistent across refreshes
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const quoteIndex = dayOfYear % quotes.length;
    setTodayQuote(quotes[quoteIndex]);

    // Show modal if not dismissed today
    if (lastDismissed !== today) {
      setShowModal(true);
    }
  }, [quotes]);

  const dismiss = () => {
    const today = new Date().toDateString();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, today);
    }
    setShowModal(false);
  };

  return { showModal, todayQuote, dismiss };
}

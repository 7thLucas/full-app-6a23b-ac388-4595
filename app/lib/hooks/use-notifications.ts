import { useEffect, useRef, useCallback } from "react";
import type { ClassEntry } from "./use-classes";
import { DAYS_ORDER, getTodayName, getMinutesUntilClass } from "./use-classes";

export function useClassNotifications(
  classes: ClassEntry[],
  enabled: boolean,
  leadTimes: { first: number; second: number } = { first: 60, second: 30 }
) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const result = await Notification.requestPermission();
      return result === "granted";
    }
    return false;
  }, []);

  const scheduleNotifications = useCallback(
    (classList: ClassEntry[]) => {
      // Clear existing timers
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      if (!enabled || typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      classList
        .filter((c) => c.remindersEnabled !== false)
        .forEach((cls) => {
          const minutesUntil = getMinutesUntilClass(cls);

          [leadTimes.first, leadTimes.second].forEach((lead) => {
            const delay = (minutesUntil - lead) * 60 * 1000;
            if (delay > 0 && delay < 7 * 24 * 60 * 60 * 1000) {
              const timer = setTimeout(() => {
                if (Notification.permission === "granted") {
                  new Notification(`Class starting in ${lead} minutes`, {
                    body: `${cls.subjectName} — ${cls.room || cls.location || "Check your timetable"}`,
                    icon: "/favicon.ico",
                    tag: `class-${cls._id}-${lead}`,
                  });
                }
              }, delay);
              timersRef.current.push(timer);
            }
          });
        });
    },
    [enabled, leadTimes.first, leadTimes.second]
  );

  useEffect(() => {
    if (enabled && classes.length > 0) {
      requestPermission().then((granted) => {
        if (granted) scheduleNotifications(classes);
      });
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [classes, enabled, scheduleNotifications, requestPermission]);

  return { requestPermission };
}

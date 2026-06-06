import { useState, useEffect, useCallback } from "react";

export interface ClassEntry {
  _id: string;
  subjectName: string;
  day: string;
  startTime: string;
  endTime?: string;
  room?: string;
  location?: string;
  colorHex?: string;
  remindersEnabled?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface CreateClassDto {
  subjectName: string;
  day: string;
  startTime: string;
  endTime?: string;
  room?: string;
  location?: string;
  colorHex?: string;
  remindersEnabled?: boolean;
  notes?: string;
}

const API_BASE = "/api/classes";

export function useClasses() {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (json.success) {
        setClasses(json.data);
      } else {
        setError(json.message || "Failed to load classes");
      }
    } catch {
      setError("Network error loading classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const addClass = useCallback(async (data: CreateClassDto): Promise<ClassEntry | null> => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setClasses((prev) => [...prev, json.data]);
        return json.data;
      }
      throw new Error(json.message);
    } catch (err: any) {
      setError(err?.message || "Failed to add class");
      return null;
    }
  }, []);

  const updateClass = useCallback(async (id: string, data: Partial<CreateClassDto>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setClasses((prev) => prev.map((c) => (c._id === id ? { ...c, ...json.data } : c)));
        return true;
      }
      throw new Error(json.message);
    } catch (err: any) {
      setError(err?.message || "Failed to update class");
      return false;
    }
  }, []);

  const deleteClass = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setClasses((prev) => prev.filter((c) => c._id !== id));
        return true;
      }
      throw new Error(json.message);
    } catch (err: any) {
      setError(err?.message || "Failed to delete class");
      return false;
    }
  }, []);

  const toggleReminder = useCallback(async (id: string, enabled: boolean): Promise<boolean> => {
    return updateClass(id, { remindersEnabled: enabled });
  }, [updateClass]);

  return { classes, loading, error, fetchClasses, addClass, updateClass, deleteClass, toggleReminder };
}

export const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function getTodayName(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

export function getNextUpcomingClass(classes: ClassEntry[]): ClassEntry | null {
  const today = getTodayName();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayIndex = DAYS_ORDER.indexOf(today);

  // Sort classes by day and time
  const sorted = [...classes].sort((a, b) => {
    const dayDiff = DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  // First look for classes later today
  const laterToday = sorted.filter(
    (c) => c.day === today && c.startTime > currentTime
  );
  if (laterToday.length > 0) return laterToday[0];

  // Then look for classes in upcoming days this week
  const upcoming = sorted.filter(
    (c) => DAYS_ORDER.indexOf(c.day) > todayIndex
  );
  if (upcoming.length > 0) return upcoming[0];

  // Wrap around to next week
  if (sorted.length > 0) return sorted[0];

  return null;
}

export function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export function getMinutesUntilClass(classEntry: ClassEntry): number {
  const today = getTodayName();
  const now = new Date();
  const dayDiff = (DAYS_ORDER.indexOf(classEntry.day) - DAYS_ORDER.indexOf(today) + 7) % 7;
  const [h, m] = classEntry.startTime.split(":").map(Number);
  const classMinutes = dayDiff * 24 * 60 + h * 60 + m;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  if (dayDiff === 0 && classMinutes < nowMinutes) {
    // Already passed today — count as next week
    return 7 * 24 * 60 - nowMinutes + classMinutes;
  }
  return classMinutes - nowMinutes;
}

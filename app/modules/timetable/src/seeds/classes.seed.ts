import { ClassModel } from "../models/class.model";

/**
 * Seed sample class entries on first run.
 * Idempotent: only runs if no classes exist.
 */
export async function seedClasses(): Promise<void> {
  const existing = await ClassModel.countDocuments();
  if (existing > 0) return;

  const sampleClasses = [
    {
      subjectName: "Mathematics 201",
      day: "Monday",
      startTime: "08:00",
      endTime: "10:00",
      room: "Block A, Room 201",
      colorHex: "#4338ca",
      remindersEnabled: true,
    },
    {
      subjectName: "Introduction to Programming",
      day: "Monday",
      startTime: "13:00",
      endTime: "15:00",
      room: "ICT Lab 3",
      colorHex: "#06b6d4",
      remindersEnabled: true,
    },
    {
      subjectName: "Technical Writing",
      day: "Tuesday",
      startTime: "09:00",
      endTime: "11:00",
      room: "Block B, Room 104",
      colorHex: "#10b981",
      remindersEnabled: true,
    },
    {
      subjectName: "Engineering Physics",
      day: "Wednesday",
      startTime: "08:00",
      endTime: "10:00",
      room: "Science Hall 2",
      colorHex: "#f59e0b",
      remindersEnabled: true,
    },
    {
      subjectName: "Calculus II",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "16:00",
      room: "Block A, Room 302",
      colorHex: "#8b5cf6",
      remindersEnabled: true,
    },
    {
      subjectName: "Data Structures",
      day: "Thursday",
      startTime: "10:00",
      endTime: "12:00",
      room: "ICT Lab 1",
      colorHex: "#06b6d4",
      remindersEnabled: true,
    },
    {
      subjectName: "Statistics & Probability",
      day: "Friday",
      startTime: "09:00",
      endTime: "11:00",
      room: "Block C, Room 205",
      colorHex: "#ec4899",
      remindersEnabled: true,
    },
  ];

  await ClassModel.insertMany(sampleClasses);
  console.log("[Seed] Sample classes created");
}

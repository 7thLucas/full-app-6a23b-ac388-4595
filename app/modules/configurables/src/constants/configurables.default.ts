/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TMotivationalQuote = {
  quote: string;
  author?: string;
};

export type TReminderLeadTimes = {
  first: number;
  second: number;
};

export type TDefaultConfigurableData = {
  appName: string;
  tagline?: string;
  logoUrl: string;
  brandColor: TBrandColor;
  dashboardGreeting?: string;
  motivationalQuotes?: TMotivationalQuote[];
  enableReminders?: boolean;
  reminderLeadTimes?: TReminderLeadTimes;
  studyTimerPresets?: number[];
  subjectColors?: string[];
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Uptime",
  tagline: "Never miss a class. Stay ahead. Show up.",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#4338ca",
    secondary: "#6366f1",
    accent: "#06b6d4",
  },
  dashboardGreeting: "Good morning! Let's crush today.",
  motivationalQuotes: [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { quote: "Push yourself, because no one else is going to do it for you.", author: "" },
    { quote: "Great things never come from comfort zones.", author: "" },
    { quote: "Dream it. Wish it. Do it.", author: "" },
    { quote: "Success doesn't just find you. You have to go out and get it.", author: "" },
    { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "" },
    { quote: "Don't stop when you're tired. Stop when you're done.", author: "" },
    { quote: "Wake up with determination. Go to bed with satisfaction.", author: "" },
    { quote: "Do something today that your future self will thank you for.", author: "" },
    { quote: "Little things make big days.", author: "" },
    { quote: "It's going to be hard, but hard is not impossible.", author: "" },
    { quote: "Don't wait for opportunity. Create it.", author: "" },
    { quote: "Sometimes we're tested not to show our weaknesses, but to discover our strengths.", author: "" },
    { quote: "The key to success is to focus on goals, not obstacles.", author: "" },
    { quote: "Dream bigger. Do bigger.", author: "" },
    { quote: "You are braver than you believe and stronger than you seem.", author: "A.A. Milne" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "Education is the passport to the future.", author: "Malcolm X" },
    { quote: "Study hard, for the well is deep and our brains are shallow.", author: "Richard Baxter" },
    { quote: "Knowledge is power. Power to do incredible things.", author: "" },
    { quote: "Invest in your mind. It's the best investment you'll ever make.", author: "" },
    { quote: "Every expert was once a beginner.", author: "" },
    { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { quote: "Your future is created by what you do today, not tomorrow.", author: "" },
    { quote: "One day or day one? You decide.", author: "" },
    { quote: "Be so good they can't ignore you.", author: "Steve Martin" },
    { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { quote: "Today is your opportunity to build the tomorrow you want.", author: "" },
  ],
  enableReminders: true,
  reminderLeadTimes: {
    first: 60,
    second: 30,
  },
  studyTimerPresets: [25, 45, 60, 90],
  subjectColors: [
    "#4338ca",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
  ],
};

import { useConfigurables } from "~/modules/configurables";
import { AppLayout } from "~/components/layout/app-layout";
import { WordOfDayModal } from "~/components/ui/word-of-day-modal";
import { ClassCard } from "~/components/ui/class-card";
import { useClasses, getTodayName, getNextUpcomingClass, formatTime, DAYS_ORDER } from "~/lib/hooks/use-classes";
import { useWordOfDay } from "~/lib/hooks/use-word-of-day";
import { useClassNotifications } from "~/lib/hooks/use-notifications";
import { Link } from "react-router";
import { CalendarDays, Timer, Bell, BellOff, BookOpen, Clock, TrendingUp } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatCountdown(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function DashboardPage() {
  const { config, loading } = useConfigurables();
  const { classes, loading: classesLoading, toggleReminder } = useClasses();

  const quotes = config.motivationalQuotes || [];
  const { showModal, todayQuote, dismiss } = useWordOfDay(quotes);
  const enableReminders = config.enableReminders !== false;
  const leadTimes = config.reminderLeadTimes || { first: 60, second: 30 };
  useClassNotifications(classes, enableReminders, leadTimes);

  const today = getTodayName();
  const todayClasses = classes.filter((c) => c.day === today);
  const nextClass = getNextUpcomingClass(classes);
  const appName = loading ? "Uptime" : (config.appName ?? "Uptime");
  const greeting = config.dashboardGreeting || `${getGreeting()}! Let's crush today.`;

  // Compute minutes until next class
  let minutesUntilNext: number | null = null;
  if (nextClass) {
    const now = new Date();
    const dayDiff = (DAYS_ORDER.indexOf(nextClass.day) - DAYS_ORDER.indexOf(today) + 7) % 7;
    const [h, m] = nextClass.startTime.split(":").map(Number);
    const classMinutes = dayDiff * 24 * 60 + h * 60 + m;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    minutesUntilNext = classMinutes - nowMinutes;
    if (minutesUntilNext < 0) minutesUntilNext = null;
  }

  return (
    <AppLayout>
      {showModal && todayQuote && (
        <WordOfDayModal quote={todayQuote} appName={appName} onDismiss={dismiss} />
      )}

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Hero greeting */}
        <div
          className="rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4338ca 0%, #06b6d4 100%)" }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/30" />
            <div className="absolute bottom-2 right-16 w-16 h-16 rounded-full bg-white/20" />
          </div>
          <div className="relative">
            <p className="text-sm font-medium opacity-80 mb-1">{getGreeting()}</p>
            <h1 className="text-2xl font-bold leading-tight">{greeting}</h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 opacity-75" />
                <span className="text-sm font-medium opacity-90">{today}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 opacity-75" />
                <span className="text-sm font-medium opacity-90">
                  {todayClasses.length} {todayClasses.length === 1 ? "class" : "classes"} today
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next class card */}
        {nextClass && (
          <div>
            <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-3">Next Up</h2>
            <div
              className="bg-white rounded-2xl p-5 border-l-4"
              style={{
                borderColor: nextClass.colorHex || "#4338ca",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#0f172a] text-lg">{nextClass.subjectName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-[#64748b]">
                      <Clock className="w-3.5 h-3.5" />
                      {nextClass.day}, {formatTime(nextClass.startTime)}
                    </span>
                    {(nextClass.room || nextClass.location) && (
                      <span className="text-sm text-[#94a3b8]">
                        {nextClass.room || nextClass.location}
                      </span>
                    )}
                  </div>
                </div>
                {minutesUntilNext !== null && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#4338ca]">
                      {formatCountdown(minutesUntilNext)}
                    </div>
                    <div className="text-xs text-[#94a3b8]">away</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}>
            <div className="text-2xl font-bold text-[#4338ca]">{classes.length}</div>
            <div className="text-xs text-[#64748b] mt-0.5 font-medium">Total Classes</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}>
            <div className="text-2xl font-bold text-[#06b6d4]">{todayClasses.length}</div>
            <div className="text-xs text-[#64748b] mt-0.5 font-medium">Today</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}>
            <div className="text-2xl font-bold text-[#10b981]">
              {classes.filter((c) => c.remindersEnabled !== false).length}
            </div>
            <div className="text-xs text-[#64748b] mt-0.5 font-medium">Reminders</div>
          </div>
        </div>

        {/* Today's classes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider">Today's Classes</h2>
            <Link to="/timetable" className="text-sm font-semibold text-[#4338ca] hover:text-[#6366f1]">
              View all
            </Link>
          </div>

          {classesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
              ))}
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <CalendarDays className="w-10 h-10 text-[#cbd5e1] mx-auto mb-2" />
              <p className="text-[#64748b] font-medium text-sm">No classes scheduled for today</p>
              <Link to="/timetable" className="mt-2 inline-block text-sm font-semibold text-[#4338ca]">
                Add your first class
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((c) => (
                <ClassCard
                  key={c._id}
                  entry={c}
                  onToggleReminder={toggleReminder}
                  compact
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/timetable"
              className="bg-white rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#eef2ff] flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#4338ca]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0f172a]">Timetable</p>
                <p className="text-xs text-[#94a3b8]">Manage classes</p>
              </div>
            </Link>
            <Link
              to="/timers"
              className="bg-white rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#ecfeff] flex items-center justify-center">
                <Timer className="w-5 h-5 text-[#06b6d4]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0f172a]">Study Timer</p>
                <p className="text-xs text-[#94a3b8]">Focus session</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

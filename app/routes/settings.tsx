import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { AppLayout } from "~/components/layout/app-layout";
import { useConfigurables } from "~/modules/configurables";
import { useClasses, getTodayName, DAYS_ORDER } from "~/lib/hooks/use-classes";

export default function SettingsPage() {
  const { config, loading } = useConfigurables();
  const { classes } = useClasses();
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const appName = loading ? "Uptime" : (config.appName ?? "Uptime");
  const tagline = config.tagline || "Never miss a class. Stay ahead. Show up.";

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const today = getTodayName();
  const totalClasses = classes.length;
  const todayClasses = classes.filter((c) => c.day === today).length;
  const classesWithReminders = classes.filter((c) => c.remindersEnabled !== false).length;

  const primaryColor = config.brandColor?.primary || "#4338ca";
  const accentColor = config.brandColor?.accent || "#06b6d4";

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Settings</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Manage your {appName} preferences</p>
        </div>

        {/* App info card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
        >
          <div
            className="p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` }}
          >
            <div className="flex items-center gap-3">
              {!loading && config.logoUrl && config.logoUrl !== "FILL_LOGO_URL_HERE" ? (
                <img src={config.logoUrl} alt={appName} className="w-12 h-12 rounded-2xl object-cover bg-white/20" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                  U
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{appName}</h2>
                <p className="text-sm opacity-80">{tagline}</p>
              </div>
            </div>
          </div>
          <div className="bg-white grid grid-cols-3 divide-x divide-[#f1f5f9] px-0">
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-[#0f172a]">{totalClasses}</div>
              <div className="text-xs text-[#94a3b8] mt-0.5">Classes</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-[#0f172a]">{todayClasses}</div>
              <div className="text-xs text-[#94a3b8] mt-0.5">Today</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-[#0f172a]">{classesWithReminders}</div>
              <div className="text-xs text-[#94a3b8] mt-0.5">Reminders</div>
            </div>
          </div>
        </div>

        {/* Notifications section */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Notifications</h2>
          <div
            className="bg-white rounded-2xl divide-y divide-[#f8fafc]"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
          >
            <div className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                notifPermission === "granted" ? "bg-[#f0fdf4]" : "bg-[#fef2f2]"
              }`}>
                {notifPermission === "granted"
                  ? <Bell className="w-5 h-5 text-[#16a34a]" />
                  : <BellOff className="w-5 h-5 text-[#dc2626]" />
                }
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#0f172a]">Browser Notifications</p>
                <p className={`text-xs mt-0.5 ${
                  notifPermission === "granted" ? "text-[#16a34a]" :
                  notifPermission === "denied" ? "text-[#dc2626]" : "text-[#94a3b8]"
                }`}>
                  {notifPermission === "granted" ? "Enabled — you'll get class reminders"
                    : notifPermission === "denied" ? "Blocked — enable in browser settings"
                    : "Not set — tap to enable"}
                </p>
              </div>
              {notifPermission === "default" && (
                <button
                  onClick={requestNotifPermission}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
                >
                  Enable
                </button>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#4338ca]" />
                <span className="text-sm font-medium text-[#0f172a]">
                  Reminder 1: {config.reminderLeadTimes?.first ?? 60} minutes before class
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                <span className="text-sm font-medium text-[#0f172a]">
                  Reminder 2: {config.reminderLeadTimes?.second ?? 30} minutes before class
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] mt-2">
                Two-stage reminders keep you on time. Toggle per class in Timetable.
              </p>
            </div>
          </div>
        </div>

        {/* Timetable section */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">Schedule</h2>
          <div
            className="bg-white rounded-2xl"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
          >
            {DAYS_ORDER.map((day, i) => {
              const count = classes.filter((c) => c.day === day).length;
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i < DAYS_ORDER.length - 1 ? "border-b border-[#f8fafc]" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isToday ? "text-[#4338ca] font-bold" : "text-[#0f172a]"}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-[#eef2ff] text-[#4338ca] font-semibold px-1.5 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${count > 0 ? "text-[#4338ca]" : "text-[#cbd5e1]"}`}>
                    {count > 0 ? `${count} ${count === 1 ? "class" : "classes"}` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* About */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">About</h2>
          <div
            className="bg-white rounded-2xl p-5 flex items-start gap-4"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
            >
              U
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a]">{appName}</h3>
              <p className="text-sm text-[#64748b] mt-1 leading-relaxed">
                A creative digital timetable for tertiary students. Manage your schedule, set smart alarms,
                study with focus timers, and start every day motivated.
              </p>
              <p className="text-xs text-[#94a3b8] mt-2">Designed for students who show up.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { AppLayout } from "~/components/layout/app-layout";
import { useConfigurables } from "~/modules/configurables";

const DEFAULT_PRESETS = [25, 45, 60, 90];

function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type TimerStatus = "idle" | "running" | "paused" | "done";

export default function TimersPage() {
  const { config } = useConfigurables();
  const presets = config.studyTimerPresets && config.studyTimerPresets.length > 0
    ? config.studyTimerPresets
    : DEFAULT_PRESETS;

  const [selectedMinutes, setSelectedMinutes] = useState(presets[0] || 25);
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [sessionLabel, setSessionLabel] = useState("");
  const [totalSeconds, setTotalSeconds] = useState((presets[0] || 25) * 60);
  const [secondsLeft, setSecondsLeft] = useState((presets[0] || 25) * 60);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [completedSessions, setCompletedSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    if (status === "done") return;
    setStatus("running");
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setStatus("done");
          setCompletedSessions((s) => s + 1);
          // Browser notification on completion
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification("Study session complete!", {
              body: `Great work${sessionLabel ? ` on "${sessionLabel}"` : ""}! Take a break.`,
              icon: "/favicon.ico",
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [status, sessionLabel, clearTimer]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setStatus("paused");
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setSecondsLeft(totalSeconds);
    setStatus("idle");
  }, [clearTimer, totalSeconds]);

  const selectPreset = useCallback((minutes: number) => {
    clearTimer();
    setSelectedMinutes(minutes);
    setCustomMinutes("");
    setTotalSeconds(minutes * 60);
    setSecondsLeft(minutes * 60);
    setStatus("idle");
  }, [clearTimer]);

  const applyCustom = useCallback(() => {
    const parsed = parseInt(customMinutes, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 300) return;
    clearTimer();
    setSelectedMinutes(parsed);
    setTotalSeconds(parsed * 60);
    setSecondsLeft(parsed * 60);
    setStatus("idle");
  }, [customMinutes, clearTimer]);

  // Progress ring
  const RADIUS = 90;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const percentLeft = Math.round(progress * 100);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Study Timer</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Stay focused, stay ahead</p>
        </div>

        {/* Session label input */}
        <div>
          <input
            type="text"
            placeholder="Session label (e.g. Calc Exam Prep)"
            value={sessionLabel}
            onChange={(e) => setSessionLabel(e.target.value)}
            disabled={status === "running"}
            className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] bg-white transition-all disabled:opacity-60"
          />
        </div>

        {/* Preset buttons */}
        <div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Duration</p>
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => selectPreset(p)}
                disabled={status === "running"}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 ${
                  selectedMinutes === p && !customMinutes
                    ? "bg-[#4338ca] text-white shadow-sm"
                    : "bg-white text-[#64748b] hover:bg-[#f1f5f9]"
                }`}
                style={
                  selectedMinutes === p && !customMinutes
                    ? { boxShadow: "0 2px 8px rgba(67,56,202,0.25)" }
                    : { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                }
              >
                {p}m
              </button>
            ))}
          </div>

          {/* Custom duration */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="number"
              placeholder="Custom minutes"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              min={1}
              max={300}
              disabled={status === "running"}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] bg-white transition-all disabled:opacity-60"
            />
            <button
              onClick={applyCustom}
              disabled={status === "running" || !customMinutes}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#4338ca] bg-[#eef2ff] hover:bg-[#e0e7ff] disabled:opacity-50 transition-colors"
            >
              Set
            </button>
          </div>
        </div>

        {/* Timer ring */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-52 h-52">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
              {/* Background track */}
              <circle
                cx="110"
                cy="110"
                r={RADIUS}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="12"
              />
              {/* Progress arc */}
              <circle
                cx="110"
                cy="110"
                r={RADIUS}
                fill="none"
                stroke="url(#timerGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: status === "running" ? "stroke-dashoffset 1s linear" : "stroke-dashoffset 0.3s ease" }}
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4338ca" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {status === "done" ? (
                <>
                  <span className="text-4xl mb-1">🎉</span>
                  <span className="text-sm font-bold text-[#10b981]">Complete!</span>
                </>
              ) : (
                <>
                  <span className="text-5xl font-bold text-[#0f172a] tabular-nums tracking-tight">
                    {formatMMSS(secondsLeft)}
                  </span>
                  <span className="text-sm text-[#94a3b8] mt-1 font-medium">
                    {selectedMinutes}m session
                  </span>
                  {sessionLabel && (
                    <span className="text-xs text-[#64748b] mt-0.5 max-w-[120px] truncate text-center">
                      {sessionLabel}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {status !== "done" && (
            <div className="text-xs text-[#94a3b8] mt-2 font-medium">
              {percentLeft}% remaining
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {status === "running" ? (
            <button
              onClick={pauseTimer}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)", boxShadow: "0 4px 20px rgba(67,56,202,0.35)" }}
            >
              <Pause className="w-7 h-7" />
            </button>
          ) : (
            <button
              onClick={startTimer}
              disabled={status === "done" || secondsLeft === 0}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)", boxShadow: "0 4px 20px rgba(67,56,202,0.35)" }}
            >
              <Play className="w-7 h-7 ml-0.5" />
            </button>
          )}

          {/* +/- 1 min adjustment */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                if (status !== "running" && secondsLeft < 300 * 60) {
                  const newSecs = secondsLeft + 60;
                  setSecondsLeft(newSecs);
                  if (status === "idle") { setTotalSeconds(newSecs); setSelectedMinutes(Math.round(newSecs / 60)); }
                }
              }}
              className="w-10 h-5 rounded-lg bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors flex items-center justify-center text-xs font-bold"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              +1m
            </button>
            <button
              onClick={() => {
                if (status !== "running" && secondsLeft > 60) {
                  const newSecs = secondsLeft - 60;
                  setSecondsLeft(newSecs);
                  if (status === "idle") { setTotalSeconds(newSecs); setSelectedMinutes(Math.round(newSecs / 60)); }
                }
              }}
              className="w-10 h-5 rounded-lg bg-white text-[#64748b] hover:bg-[#f1f5f9] transition-colors flex items-center justify-center text-xs font-bold"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
            >
              -1m
            </button>
          </div>
        </div>

        {/* Status messages */}
        {status === "running" && (
          <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-2xl p-4 text-center">
            <p className="text-sm font-semibold text-[#4338ca]">
              {sessionLabel ? `Focusing on "${sessionLabel}"` : "Locked in — keep going!"}
            </p>
            <p className="text-xs text-[#6366f1] mt-0.5">Notifications are ON. Stay focused.</p>
          </div>
        )}

        {status === "done" && (
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 text-center">
            <p className="text-base font-bold text-[#16a34a]">Session complete! Great work.</p>
            <p className="text-sm text-[#4ade80] mt-0.5">Take a well-deserved break.</p>
            <button
              onClick={resetTimer}
              className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
            >
              Start Another
            </button>
          </div>
        )}

        {/* Stats */}
        {completedSessions > 0 && (
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)" }}>
            <div>
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Sessions today</p>
              <p className="text-2xl font-bold text-[#4338ca] mt-0.5">{completedSessions}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#eef2ff] flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

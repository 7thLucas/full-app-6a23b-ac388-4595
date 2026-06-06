import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import type { ClassEntry, CreateClassDto } from "~/lib/hooks/use-classes";
import { DAYS_ORDER } from "~/lib/hooks/use-classes";

const DEFAULT_COLORS = [
  "#4338ca", "#06b6d4", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#f97316",
];

interface ClassFormModalProps {
  open: boolean;
  editEntry?: ClassEntry | null;
  subjectColors?: string[];
  onClose: () => void;
  onSave: (data: CreateClassDto) => Promise<boolean>;
}

const emptyForm: CreateClassDto = {
  subjectName: "",
  day: "Monday",
  startTime: "09:00",
  endTime: "",
  room: "",
  location: "",
  colorHex: "#4338ca",
  remindersEnabled: true,
  notes: "",
};

export function ClassFormModal({ open, editEntry, subjectColors, onClose, onSave }: ClassFormModalProps) {
  const [form, setForm] = useState<CreateClassDto>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = subjectColors && subjectColors.length > 0 ? subjectColors : DEFAULT_COLORS;

  useEffect(() => {
    if (open) {
      if (editEntry) {
        setForm({
          subjectName: editEntry.subjectName,
          day: editEntry.day,
          startTime: editEntry.startTime,
          endTime: editEntry.endTime || "",
          room: editEntry.room || "",
          location: editEntry.location || "",
          colorHex: editEntry.colorHex || "#4338ca",
          remindersEnabled: editEntry.remindersEnabled !== false,
          notes: editEntry.notes || "",
        });
      } else {
        setForm(emptyForm);
      }
      setErrors({});
    }
  }, [open, editEntry]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.subjectName.trim()) e.subjectName = "Subject name is required";
    if (!form.startTime) e.startTime = "Start time is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    const ok = await onSave(form);
    setSaving(false);
    if (ok) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl overflow-hidden"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f1f5f9]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
            >
              <Plus className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0f172a]">
              {editEntry ? "Edit Class" : "Add Class"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-colors"
          >
            <X className="w-4 h-4 text-[#64748b]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Subject name */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">Subject Name *</label>
            <input
              type="text"
              value={form.subjectName}
              onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
              placeholder="e.g. Mathematics 201"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all ${
                errors.subjectName ? "border-red-400" : "border-[#e2e8f0]"
              }`}
            />
            {errors.subjectName && <p className="mt-1 text-xs text-red-500">{errors.subjectName}</p>}
          </div>

          {/* Day */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">Day *</label>
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all bg-white"
            >
              {DAYS_ORDER.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">Start Time *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all ${
                  errors.startTime ? "border-red-400" : "border-[#e2e8f0]"
                }`}
              />
              {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
              />
            </div>
          </div>

          {/* Room */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">Room / Location</label>
            <input
              type="text"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="e.g. Block A, Room 204"
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Subject Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, colorHex: c })}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    form.colorHex === c ? "border-[#0f172a] scale-110" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Reminders toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">Smart Reminders</p>
              <p className="text-xs text-[#94a3b8]">1 hour & 30 min before class</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, remindersEnabled: !form.remindersEnabled })}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                form.remindersEnabled ? "bg-[#4338ca]" : "bg-[#e2e8f0]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                  form.remindersEnabled ? "left-5.5 translate-x-0.5" : "left-0.5"
                }`}
                style={{ left: form.remindersEnabled ? "22px" : "2px" }}
              />
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Lecturer name, tips, etc."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
          >
            {saving ? "Saving..." : editEntry ? "Save Changes" : "Add Class"}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

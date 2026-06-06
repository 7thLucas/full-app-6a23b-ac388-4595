import { Bell, BellOff, Edit2, Trash2, MapPin, Clock } from "lucide-react";
import type { ClassEntry } from "~/lib/hooks/use-classes";
import { formatTime } from "~/lib/hooks/use-classes";

interface ClassCardProps {
  entry: ClassEntry;
  onEdit?: (entry: ClassEntry) => void;
  onDelete?: (id: string) => void;
  onToggleReminder?: (id: string, enabled: boolean) => void;
  compact?: boolean;
}

export function ClassCard({ entry, onEdit, onDelete, onToggleReminder, compact }: ClassCardProps) {
  const color = entry.colorHex || "#4338ca";
  const remindersOn = entry.remindersEnabled !== false;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(67,56,202,0.06)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#0f172a] text-base truncate">{entry.subjectName}</h3>
            <div className="flex items-center gap-1 mt-1.5">
              <Clock className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
              <span className="text-sm text-[#64748b] font-medium">
                {formatTime(entry.startTime)}
                {entry.endTime && ` – ${formatTime(entry.endTime)}`}
              </span>
            </div>
            {(entry.room || entry.location) && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                <span className="text-sm text-[#64748b] truncate">
                  {entry.room || entry.location}
                </span>
              </div>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {onToggleReminder && (
                <button
                  onClick={() => onToggleReminder(entry._id, !remindersOn)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    remindersOn
                      ? "text-[#4338ca] bg-[#eef2ff] hover:bg-[#e0e7ff]"
                      : "text-[#94a3b8] bg-[#f8fafc] hover:bg-[#f1f5f9]"
                  }`}
                  title={remindersOn ? "Reminders on" : "Reminders off"}
                >
                  {remindersOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1.5 rounded-lg text-[#64748b] bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(entry._id)}
                  className="p-1.5 rounded-lg text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {!compact && entry.notes && (
          <p className="mt-2 text-xs text-[#94a3b8] line-clamp-2">{entry.notes}</p>
        )}
      </div>
    </div>
  );
}

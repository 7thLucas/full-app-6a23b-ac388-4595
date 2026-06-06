import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppLayout } from "~/components/layout/app-layout";
import { ClassCard } from "~/components/ui/class-card";
import { ClassFormModal } from "~/components/ui/class-form-modal";
import { useClasses, DAYS_ORDER, getTodayName } from "~/lib/hooks/use-classes";
import { useConfigurables } from "~/modules/configurables";
import type { ClassEntry, CreateClassDto } from "~/lib/hooks/use-classes";

export default function TimetablePage() {
  const { config } = useConfigurables();
  const { classes, loading, addClass, updateClass, deleteClass, toggleReminder } = useClasses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<ClassEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("All");

  const today = getTodayName();
  const subjectColors = config.subjectColors;

  const days = ["All", ...DAYS_ORDER];

  const filteredClasses = classes.filter((c) => {
    const matchDay = selectedDay === "All" || c.day === selectedDay;
    const matchSearch =
      !searchQuery ||
      c.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.room || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchDay && matchSearch;
  });

  const groupedByDay: Record<string, ClassEntry[]> = {};
  const daysToShow = selectedDay === "All" ? DAYS_ORDER : [selectedDay];
  daysToShow.forEach((d) => {
    const dayClasses = filteredClasses.filter((c) => c.day === d);
    if (dayClasses.length > 0) groupedByDay[d] = dayClasses;
  });

  const handleAdd = () => {
    setEditEntry(null);
    setModalOpen(true);
  };

  const handleEdit = (entry: ClassEntry) => {
    setEditEntry(entry);
    setModalOpen(true);
  };

  const handleSave = async (data: CreateClassDto): Promise<boolean> => {
    if (editEntry) {
      return updateClass(editEntry._id, data);
    } else {
      const result = await addClass(data);
      return result !== null;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this class?")) {
      deleteClass(id);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Timetable</h1>
            <p className="text-sm text-[#64748b] mt-0.5">
              {classes.length} {classes.length === 1 ? "class" : "classes"} scheduled
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Class</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/30 focus:border-[#4338ca] bg-white transition-all"
          />
        </div>

        {/* Day filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {days.map((day) => {
            const isActive = selectedDay === day;
            const isToday = day === today;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "bg-[#4338ca] text-white shadow-sm"
                    : "bg-white text-[#64748b] hover:bg-[#f1f5f9]"
                }`}
                style={
                  isActive
                    ? { boxShadow: "0 2px 8px rgba(67,56,202,0.25)" }
                    : { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                }
              >
                {day}
                {isToday && day !== "All" && (
                  <span className={`ml-1.5 w-1.5 h-1.5 rounded-full inline-block ${isActive ? "bg-white/70" : "bg-[#06b6d4]"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Classes list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : Object.keys(groupedByDay).length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #eef2ff, #ecfeff)" }}
            >
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-[#0f172a] font-semibold text-base">No classes found</p>
            <p className="text-[#94a3b8] text-sm mt-1">
              {searchQuery ? "Try a different search" : "Add your first class to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAdd}
                className="mt-4 px-5 py-2.5 rounded-xl text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
              >
                Add Class
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {daysToShow
              .filter((d) => groupedByDay[d])
              .map((day) => (
                <div key={day}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className={`text-sm font-bold uppercase tracking-wider ${day === today ? "text-[#4338ca]" : "text-[#64748b]"}`}>
                      {day}
                    </h2>
                    {day === today && (
                      <span className="text-xs bg-[#eef2ff] text-[#4338ca] font-semibold px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                    <span className="text-xs text-[#94a3b8]">
                      {groupedByDay[day].length} {groupedByDay[day].length === 1 ? "class" : "classes"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {groupedByDay[day].map((c) => (
                      <ClassCard
                        key={c._id}
                        entry={c}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleReminder={toggleReminder}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <ClassFormModal
        open={modalOpen}
        editEntry={editEntry}
        subjectColors={subjectColors}
        onClose={() => { setModalOpen(false); setEditEntry(null); }}
        onSave={handleSave}
      />
    </AppLayout>
  );
}

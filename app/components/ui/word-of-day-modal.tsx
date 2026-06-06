import { X, Quote } from "lucide-react";
import type { TMotivationalQuote } from "~/modules/configurables/src/constants/configurables.default";

interface WordOfDayModalProps {
  quote: TMotivationalQuote;
  appName: string;
  onDismiss: () => void;
}

export function WordOfDayModal({ quote, appName, onDismiss }: WordOfDayModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Gradient header */}
        <div
          className="px-7 pt-8 pb-6 text-white relative"
          style={{ background: "linear-gradient(135deg, #4338ca 0%, #06b6d4 100%)" }}
        >
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
              <span className="text-xs font-bold">U</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest opacity-80">{appName}</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
            Word of the Day
          </p>
          <p className="text-sm font-medium opacity-80">Your daily dose of motivation</p>
        </div>

        {/* Quote body */}
        <div className="px-7 py-6">
          <div className="relative">
            <Quote className="absolute -top-2 -left-1 w-8 h-8 text-[#06b6d4] opacity-30 rotate-180" />
            <blockquote className="text-[#0f172a] text-xl font-semibold leading-relaxed pt-4 pl-2">
              {quote.quote}
            </blockquote>
            {quote.author && (
              <p className="mt-3 text-sm text-[#64748b] font-medium pl-2">
                — {quote.author}
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="px-7 pb-7">
          <button
            onClick={onDismiss}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #4338ca, #06b6d4)" }}
          >
            Let's Go
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

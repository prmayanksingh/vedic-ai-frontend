'use client'
import type { ReactNode } from 'react';
import { BookOpen, CalendarDays, Clock, Database, Hourglass, Inbox, MapPin, UserRound, Users, type LucideIcon } from 'lucide-react';
import { Booking, OverviewData, ServerStatus } from '@/types/api';

type Tab = "bookings" | "rituals" | "pandits";

interface DatabaseSidebarProps {
  overview: OverviewData | null;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  serverStatus: ServerStatus;
}

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "rituals", label: "Rituals", icon: BookOpen },
  { id: "pandits", label: "Pandits", icon: Users },
];

const BOOKING_STATUS: Record<Booking["status"], { label: string; dot: string; text: string }> = {
  CONFIRMED: { label: "Confirmed", dot: "bg-emerald-400", text: "text-emerald-300" },
  RESCHEDULED: { label: "Rescheduled", dot: "bg-amber-400", text: "text-amber-300" },
  CANCELLED: { label: "Cancelled", dot: "bg-red-400", text: "text-red-300" },
};

const CARD = "rounded-xl border border-white/8 bg-[#1e1f20] p-4 transition-colors hover:border-white/12";

const refName = (ref: { name: string } | string) => (typeof ref === "string" ? ref : ref.name);

const formatDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

const formatINR = (amount: number) =>
  amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const initials = (name: string) =>
  name
    .replace(/^(pt\.?|pandit)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

function Meta({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#9aa0a6]">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Inbox className="h-6 w-6 text-[#9aa0a6]" />
      <p className="max-w-60 text-sm text-[#9aa0a6]">{text}</p>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2.5" aria-label="Loading collections">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-white/8 bg-[#1e1f20] p-4">
          <div className="h-3 w-24 rounded-full bg-[#282a2c]" />
          <div className="mt-3 h-3.5 w-44 rounded-full bg-[#282a2c]" />
          <div className="mt-2.5 h-3 w-32 rounded-full bg-[#282a2c]" />
        </div>
      ))}
    </div>
  );
}

export default function DatabaseSidebar({ overview, activeTab, onTabChange, serverStatus }: DatabaseSidebarProps) {
  const counts: Record<Tab, number | null> = {
    bookings: overview?.bookings.length ?? null,
    rituals: overview?.rituals.length ?? null,
    pandits: overview?.pandits.length ?? null,
  };

  const renderBody = () => {
    if (!overview) {
      return serverStatus === "error" ? (
        <EmptyState text="Database unavailable — the backend is offline." />
      ) : (
        <SkeletonList />
      );
    }

    if (activeTab === "bookings") {
      if (overview.bookings.length === 0) return <EmptyState text="No bookings yet. Ask the agent to book a ritual." />;
      return (
        <ul className="space-y-2.5">
          {overview.bookings.map((b) => {
            const status = BOOKING_STATUS[b.status];
            return (
              <li key={b._id} className={`animate-fade-up ${CARD}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#9aa0a6]">{b.referenceCode}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
                <p
                  className={`mt-2 text-[15px] font-medium text-[#e3e3e3] ${
                    b.status === "CANCELLED" ? "line-through decoration-white/30" : ""
                  }`}
                >
                  {refName(b.ritualId)}
                </p>
                <div className="mt-1">
                  <Meta icon={UserRound}>
                    {refName(b.panditId)} <span className="text-white/20">·</span> for {b.userName}
                  </Meta>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/8 pt-3">
                  <Meta icon={CalendarDays}>{formatDate(b.date)}</Meta>
                  <Meta icon={Clock}>{b.timeSlot}</Meta>
                  <Meta icon={MapPin}>{b.city}</Meta>
                </div>
              </li>
            );
          })}
        </ul>
      );
    }

    if (activeTab === "rituals") {
      if (overview.rituals.length === 0) return <EmptyState text="No rituals found." />;
      return (
        <ul className="space-y-2.5">
          {overview.rituals.map((r) => (
            <li key={r._id} className={`animate-fade-up ${CARD}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-[#e3e3e3]">{r.name}</p>
                  <p className="mt-0.5 text-xs text-[#9aa0a6]">{r.category}</p>
                </div>
                <p className="shrink-0 text-sm font-medium text-[#e3e3e3] tabular-nums">{formatINR(r.dakshina)}</p>
              </div>
              {r.description && (
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#9aa0a6]">{r.description}</p>
              )}
              <div className="mt-3 border-t border-white/8 pt-3">
                <Meta icon={Hourglass}>{formatDuration(r.durationMinutes)}</Meta>
              </div>
            </li>
          ))}
        </ul>
      );
    }

    if (overview.pandits.length === 0) return <EmptyState text="No pandits found." />;
    return (
      <ul className="space-y-2.5">
        {overview.pandits.map((p) => (
          <li key={p._id} className={`animate-fade-up ${CARD}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#282a2c] text-xs font-medium text-[#e3e3e3]">
                {initials(p.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-[#e3e3e3]">{p.name}</p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#9aa0a6]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Available in {p.city}
                </p>
              </div>
              <span className="shrink-0 text-xs text-[#9aa0a6] tabular-nums">{p.experienceYears} yrs</span>
            </div>
            {p.specializations.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.specializations.map((s) => (
                  <span key={s} className="rounded-full bg-[#282a2c] px-2.5 py-0.5 text-xs text-[#e3e3e3]">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <aside className="flex h-full min-h-0 w-full flex-1 flex-col bg-[#18191b]">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 sm:px-5">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-medium text-[#e3e3e3]">Live Database</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#9aa0a6]">
          <span className={`h-1.5 w-1.5 rounded-full ${overview ? "bg-emerald-400" : "bg-[#9aa0a6]"}`} />
          {overview ? "Synced" : "Connecting"}
        </span>
      </div>

      <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto border-b border-white/8 px-4 sm:gap-5 sm:px-5" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(id)}
              className={`relative -mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 py-3 text-sm transition-colors ${
                active
                  ? "border-amber-400 font-medium text-[#e3e3e3]"
                  : "border-transparent text-[#9aa0a6] hover:text-[#e3e3e3]"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${active ? "text-amber-400" : ""}`} />
              {label}
              <span
                className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                  active ? "bg-[#282a2c] text-[#e3e3e3]" : "text-[#9aa0a6]"
                }`}
              >
                {counts[id] ?? "–"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5" role="tabpanel">
        {renderBody()}
      </div>
    </aside>
  );
}

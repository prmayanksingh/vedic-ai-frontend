'use client'
import { useState, type ReactNode } from 'react';
import { Database, MessageSquare, type LucideIcon } from 'lucide-react';

interface AppShellProps {
  header: ReactNode;
  chat: ReactNode;
  sidebar: ReactNode;
  /** Optional badge shown on the mobile "Database" switcher (e.g. bookings count). */
  databaseBadge?: number | null;
}

type MobileView = "chat" | "database";

/**
 * Full-viewport app layout.
 * - lg+: chat and database side by side (database docked right, widening on larger screens).
 * - <lg: one panel at a time with a slim switcher under the header. Both panels stay
 *   mounted so scroll position and input are preserved when switching.
 */
export default function AppShell({ header, chat, sidebar, databaseBadge }: AppShellProps) {
  const [view, setView] = useState<MobileView>("chat");

  const views: { id: MobileView; label: string; icon: LucideIcon; badge?: number | null }[] = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "database", label: "Live Database", icon: Database, badge: databaseBadge },
  ];

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#131314] text-[#e3e3e3]">
      {header}

      {/* Mobile / tablet switcher */}
      <nav className="flex shrink-0 border-b border-white/8 bg-[#131314] px-2 lg:hidden" role="tablist">
        {views.map(({ id, label, icon: Icon, badge }) => {
          const active = view === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setView(id)}
              className={`-mb-px inline-flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-sm transition-colors ${
                active
                  ? "border-amber-400 font-medium text-[#e3e3e3]"
                  : "border-transparent text-[#9aa0a6] hover:text-[#e3e3e3]"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-amber-400" : ""}`} />
              {label}
              {typeof badge === "number" && (
                <span className="rounded-full bg-[#282a2c] px-1.5 text-[11px] tabular-nums text-[#e3e3e3]">{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <main className="flex min-h-0 flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className={`min-h-0 min-w-0 flex-1 ${view === "chat" ? "flex" : "hidden"} flex-col lg:flex`}>{chat}</div>
        <div
          className={`min-h-0 min-w-0 flex-1 ${view === "database" ? "flex" : "hidden"} flex-col lg:flex lg:border-l lg:border-white/8`}
        >
          {sidebar}
        </div>
      </main>
    </div>
  );
}

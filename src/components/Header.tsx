'use client'
import { LoaderCircle, RotateCcw } from 'lucide-react';
import { ServerStatus } from '@/types/api';

interface HeaderProps {
  serverStatus: ServerStatus;
  isResetting: boolean;
  onReset: () => void;
}

const STATUS_STYLES: Record<ServerStatus, { label: string; dot: string }> = {
  waking: { label: "Waking up", dot: "bg-amber-400 animate-pulse" },
  online: { label: "Online", dot: "bg-emerald-400" },
  error: { label: "Offline", dot: "bg-red-400" },
};

export default function Header({ serverStatus, isResetting, onReset }: HeaderProps) {
  const status = STATUS_STYLES[serverStatus];
  const resetDisabled = isResetting || serverStatus !== "online";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-[#131314] px-3 sm:px-5 2xl:px-8">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-base leading-none text-amber-400"
          aria-hidden
        >
          ॐ
        </span>
        <h1 className="truncate text-base font-semibold tracking-tight text-[#e3e3e3]">Vedic AI Engine</h1>
        <span className="hidden truncate text-[13px] text-[#9aa0a6] md:inline">· Rigveda &amp; ritual booking agent</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          role="status"
          aria-live="polite"
          title={status.label}
          className="inline-flex h-8 items-center gap-2 rounded-full border border-white/8 px-2.5 text-xs text-[#9aa0a6]"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          <span className="sr-only sm:not-sr-only">{status.label}</span>
        </span>

        <button
          type="button"
          onClick={onReset}
          disabled={resetDisabled}
          aria-label="Reset demo"
          title="Reset demo data"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/12 px-2.5 text-xs sm:px-3 font-medium text-[#e3e3e3] transition-colors hover:bg-[#282a2c] disabled:cursor-not-allowed disabled:text-[#9aa0a6] disabled:hover:bg-transparent"
        >
          {isResetting ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{isResetting ? "Resetting…" : "Reset Demo"}</span>
        </button>
      </div>
    </header>
  );
}

'use client'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowUp,
  BookOpen,
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  LoaderCircle,
  Sparkles,
  TriangleAlert,
  UserSearch,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ChatMessage, ServerStatus } from '@/types/api';

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  isSending: boolean;
  serverStatus: ServerStatus;
  error: string | null;
  onInputChange: (val: string) => void;
  onSend: (promptText?: string) => void;
}

const QUICK_PROMPTS: { label: string; prompt: string; icon: LucideIcon }[] = [
  {
    label: "Explore Rigveda hymns",
    prompt: "Explain the first hymn of the Rigveda (Agni Sukta) and its meaning",
    icon: BookOpen,
  },
  {
    label: "Check Pandit availability",
    prompt: "Which Pandits are available in Varanasi for a Griha Pravesh puja?",
    icon: UserSearch,
  },
  {
    label: "Book a ritual",
    prompt: "Book a Satyanarayan Puja for this Sunday morning",
    icon: CalendarPlus,
  },
  {
    label: "Reschedule or cancel",
    prompt: "I want to reschedule or cancel my existing booking",
    icon: CalendarClock,
  },
];

function AssistantMark({ spinning = false }: { spinning?: boolean }) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/8 bg-[#1e1f20]">
      <Sparkles className={`h-3.5 w-3.5 text-amber-400 ${spinning ? "animate-spin [animation-duration:2.5s]" : ""}`} />
    </div>
  );
}

export default function ChatPanel({
  messages,
  input,
  isSending,
  serverStatus,
  error,
  onInputChange,
  onSend,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Auto-grow the textarea with its content.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const canSend = serverStatus === "online" && !isSending;
  const isHero = messages.length === 1;

  const bannerMessage =
    error ??
    (serverStatus === "error"
      ? "Could not reach the Vedic AI backend. Please refresh the page or try again shortly."
      : null);
  const showBanner = bannerMessage !== null && bannerMessage !== dismissedError;

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col bg-[#131314]">
      <div className="flex-1 overflow-y-auto">
        {isHero ? (
          /* ── Hero greeting ── */
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-4 pb-4 pt-6 sm:px-6 2xl:max-w-3xl">
            <div className="animate-fade-up mb-5">
              <div className="mb-3 flex h-10 w-10 items-center sm:mb-4 sm:h-11 sm:w-11 justify-center rounded-full border border-white/8 bg-[#1e1f20]">
                <span className="text-xl leading-none text-amber-400" aria-hidden>
                  ॐ
                </span>
              </div>
              <h2 className="text-xl font-medium sm:text-2xl tracking-tight text-[#e3e3e3]">Namaste. How can I guide you today?</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed sm:text-[15px] text-[#9aa0a6]">{messages[0].content}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {QUICK_PROMPTS.map(({ label, prompt, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onSend(prompt)}
                  disabled={!canSend}
                  className="animate-fade-up flex flex-col items-start gap-2 rounded-2xl border border-white/8 bg-[#1e1f20] p-3 text-left sm:gap-3 sm:p-4 transition-colors hover:bg-[#282a2c] disabled:cursor-not-allowed disabled:hover:bg-[#1e1f20]"
                >
                  <Icon className="h-4 w-4 text-amber-400" />
                  <span>
                    <span className="block text-[13px] font-medium leading-snug text-[#e3e3e3] sm:text-sm">{label}</span>
                    <span className="mt-1 line-clamp-2 hidden text-[13px] sm:block leading-snug text-[#9aa0a6]">{prompt}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Conversation ── */
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:gap-7 sm:px-6 sm:py-8 2xl:max-w-4xl">
            {messages.map((msg, idx) => {
              if (msg.role === "user") {
                return (
                  <div key={idx} className="animate-fade-up flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap wrap-break-word rounded-3xl rounded-br-lg bg-[#282a2c] px-4 py-2.5 text-[15px] leading-relaxed text-[#e3e3e3] sm:max-w-[75%]">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              const toolCalls = msg.toolCalls ?? [];
              const hasSteps = typeof msg.stepsCount === "number" && msg.stepsCount > 0;

              return (
                <div key={idx} className="animate-fade-up flex gap-3 sm:gap-4">
                  <AssistantMark />
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="whitespace-pre-wrap wrap-break-word text-[15px] leading-7 text-[#e3e3e3]">
                      {msg.content}
                    </div>

                    {(toolCalls.length > 0 || hasSteps) && (
                      <details className="group mt-3">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/8 bg-[#1e1f20] px-2.5 py-1 text-xs text-[#9aa0a6] transition-colors hover:bg-[#282a2c] hover:text-[#e3e3e3] [&::-webkit-details-marker]:hidden">
                          <Wrench className="h-3 w-3 text-amber-400" />
                          {toolCalls.length} tool {toolCalls.length === 1 ? "call" : "calls"}
                          {hasSteps && (
                            <>
                              <span className="text-white/20">·</span>
                              {msg.stepsCount} {msg.stepsCount === 1 ? "step" : "steps"}
                            </>
                          )}
                          {toolCalls.length > 0 && (
                            <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
                          )}
                        </summary>

                        {toolCalls.length > 0 && (
                          <ul className="mt-2 space-y-1.5">
                            {toolCalls.map((tool, tIdx) => (
                              <li
                                key={`${tool.toolName}-${tIdx}`}
                                className="rounded-xl border border-white/8 bg-[#1e1f20] px-3 py-2"
                              >
                                <span className="font-mono text-xs text-[#e3e3e3]">{tool.toolName}</span>
                                {Object.keys(tool.input ?? {}).length > 0 && (
                                  <code className="mt-1 block overflow-x-auto whitespace-pre font-mono text-[11px] text-[#9aa0a6]">
                                    {JSON.stringify(tool.input)}
                                  </code>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </details>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="animate-fade-up flex items-center gap-3 sm:gap-4">
                <AssistantMark spinning />
                <span className="text-sm text-[#9aa0a6]">Thinking…</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Composer ── */}
      <div className="shrink-0 bg-[#131314]">
        <div className="mx-auto w-full max-w-3xl space-y-3 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 sm:pb-5 2xl:max-w-4xl">
          {showBanner && (
            <div
              role="alert"
              className="animate-fade-up flex items-start gap-2.5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-sm text-red-200"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="flex-1">{bannerMessage}</p>
              <button
                type="button"
                onClick={() => setDismissedError(bannerMessage)}
                className="rounded-full p-0.5 text-red-300 transition-colors hover:bg-white/8"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {!isHero && (
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
              {QUICK_PROMPTS.map(({ label, prompt, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onSend(prompt)}
                  disabled={!canSend}
                  title={prompt}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/8 bg-[#1e1f20] px-3 py-1.5 text-xs text-[#e3e3e3] transition-colors hover:bg-[#282a2c] disabled:cursor-not-allowed disabled:text-[#9aa0a6] disabled:hover:bg-[#1e1f20]"
                >
                  <Icon className="h-3.5 w-3.5 text-amber-400" />
                  {label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSend) onSend();
            }}
            className="flex items-end gap-3 rounded-3xl border border-white/10 bg-[#1e1f20] py-2.5 pl-4 pr-2.5 transition-colors sm:px-4 sm:py-3 focus-within:border-white/25"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={serverStatus !== "online"}
              placeholder={
                serverStatus === "online"
                  ? "Ask about hymns, Pandits, or your bookings"
                  : serverStatus === "waking"
                    ? "Waking up the server…"
                    : "Server unavailable"
              }
              className="max-h-50 min-h-6 flex-1 resize-none self-center bg-transparent py-1.5 text-base leading-6 text-[#e3e3e3] sm:text-[15px] placeholder:text-[#9aa0a6] focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!canSend || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[#131314] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-[#282a2c] disabled:text-[#9aa0a6]"
            >
              {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4.5 w-4.5" />}
            </button>
          </form>

          <p className="hidden text-center text-[11px] text-[#9aa0a6] sm:block">
            Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </div>
    </section>
  );
}

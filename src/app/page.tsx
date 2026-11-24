'use client'
import { checkBackendHealth, fetchOverview, resetDemoData, sendChatMessage } from '@/lib/apiClient';
import { ChatMessage, OverviewData, ServerStatus } from '@/types/api'
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import DatabaseSidebar from '@/components/DatabaseSidebar';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Namaste! I am the Vedic AI . Ask me about Rigveda hymns, check Pandit availability, or book, reschedule, and cancel a ritual.",
  },
];

export default function HomePage() {
  const [serverStatus, setServerStatus] = useState<ServerStatus>("waking");
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "rituals" | "pandits">("bookings");

  const handleSendMessage = async (promptText?: string) => {
    const text = (promptText ?? input).trim();

    if (!text || isSending || serverStatus !== "online") {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setError(null);
    setIsSending(true);

    if (!promptText) {
      setInput("");
    }

    try {
      const response = await sendChatMessage(updatedMessages);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.reply,
        stepsCount: response.stepsCount,
        toolCalls: response.toolCalls
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const overviewData = await fetchOverview();
      setOverview(overviewData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response from agent");
    } finally {
      setIsSending(false);
    }
  }

  const handleResetDemo = async () => {
    if (isResetting || serverStatus !== "online") {
      return;
    }

    setIsResetting(true);
    setError(null);

    try {
      await resetDemoData();
      setMessages(INITIAL_MESSAGES);
      const overviewData = await fetchOverview();
      setOverview(overviewData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset demo data.");
    } finally {
      setIsResetting(false);
    }
  }

  useEffect(() => {

    let isMounted = true;

    async function init() {
      // checks if backend started or not
      const isHealthy = await checkBackendHealth();
      if (!isMounted) return;

      if (!isHealthy) {
        setServerStatus("error");
        return;
      }

      setServerStatus("online");

      // fetches the overview data (pandits, rituals and bookings)
      try {
        const overviewData = await fetchOverview();
        if (isMounted) setOverview(overviewData);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load overview");
      }
    }

    init();

    return () => {
      isMounted = false;
    }

  }, [])


  return (
    <AppShell
      header={<Header serverStatus={serverStatus} isResetting={isResetting} onReset={handleResetDemo} />}
      chat={
        <ChatPanel
          messages={messages}
          input={input}
          isSending={isSending}
          serverStatus={serverStatus}
          error={error}
          onInputChange={setInput}
          onSend={handleSendMessage}
        />
      }
      sidebar={
        <DatabaseSidebar
          overview={overview}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          serverStatus={serverStatus}
        />
      }
      databaseBadge={overview?.bookings.length ?? null}
    />
  );
}
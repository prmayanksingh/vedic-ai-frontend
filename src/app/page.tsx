'use client'
import { checkBackendHealth, fetchOverview } from '@/lib/apiClient';
import { ChatMessage, OverviewData, ServerStatus } from '@/types/api'
import { useEffect, useState } from 'react';

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
        setError(err instanceof Error ? err.message : "Failed to load overview");
      }
    }

    init();

    return () => {
      isMounted = false;
    }

  }, [])


  return (
    <main>
      <p>Server Status: {serverStatus}</p>
    </main>
  );
}
import { AgentChatResponse, ChatMessage, OverviewData } from "@/types/api";


const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error("API_URL is not defined in environment variables.");
}

export async function checkBackendHealth(): Promise<boolean> {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return res.ok;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<AgentChatResponse> {
    // send only {role , content} without stepsCount and toolCalls so the exta data dosen't confuse the model schema
    const cleanMessages = messages.map(({ role, content }) => ({ role, content }));

    const res = await fetch(`${API_URL}/api/agent/chat`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ messages: cleanMessages }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.error || `Chat request failed (${res.status})`);
    }

    return data as AgentChatResponse;
}

export async function fetchOverview(): Promise<OverviewData> {
    const res = await fetch(`${API_URL}/api/admin/overview`, { cache: "no-store" });

    if (!res.ok) {
        throw new Error(`Overview fetch failed (${res.status})`);
    }
    return res.json();
}

export async function resetDemoData(): Promise<void> {
    const res = await fetch(`${API_URL}/api/admin/reset-demo`, {
        method: "POST",
    });
    
    if (!res.ok) {
        throw new Error(`Reset failed (${res.status})`);
    }
}
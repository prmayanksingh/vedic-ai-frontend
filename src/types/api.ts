export type ServerStatus = "waking" | "online" | "error";

export interface ToolCallTrace {
    toolName: string,
    input: Record<string, unknown>
}

export interface ChatMessage {
    role: "user" | "assistant",
    content: string,
    stepsCount?: number,
    toolCalls?: ToolCallTrace[],
}

export interface AgentChatResponse {
    success: boolean,
    reply: string,
    stepsCount: number,
    toolCalls: ToolCallTrace[],
}

export interface Ritual {
    _id: string,
    name: string,
    category: string,
    description: string,
    durationMinutes: number,
    dakshina: number
}

export interface Pandit {
    _id: string,
    name: string,
    city: string,
    specializations: string[],
    experienceYears: number,
}

export interface Booking {
    _id: string,
    referenceCode: string,
    userName: string,
    phone: string,
    address: string,
    city: string,
    date: string,
    timeSlot: string,
    status: "CONFIRMED" | "RESCHEDULED" | "CANCELLED",
    ritualId: { _id: string, name: string, dakshina: number } | string,
    panditId: { _id: string, name: string } | string,
}

export interface OverviewData {
    rituals: Ritual[],
    pandits: Pandit[],
    bookings: Booking[]
}
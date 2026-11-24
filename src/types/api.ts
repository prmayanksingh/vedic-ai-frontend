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

// Shapes below mirror GET /api/admin/overview as returned by the backend.

export type RitualType = "pooja" | "havan";

// Mirrors the backend Mongoose `Ritual` model (IRitual).
export interface Ritual {
    _id: string,
    name: string,
    ritualType: RitualType,
    description: string,
    durationMinutes: number,
    baseDakshina: number,
    samagriKitPrice: number,
    samagriItems: string[],
    createdAt?: string,
    updatedAt?: string,
}

// Mirrors the backend Mongoose `Pandit` model (IPandit).
export interface Pandit {
    _id: string,
    name: string,
    city: string,
    languages: string[],
    specializations: RitualType[],
    experienceYears: number,
    isActive?: boolean,
    createdAt?: string,
    updatedAt?: string,
}

export type TimeSlot = "morning" | "afternoon" | "evening";
export type BookingStatus = "CONFIRMED" | "RESCHEDULED" | "CANCELLED";

// Mirrors the backend Mongoose `Booking` model (IBooking). ObjectIds arrive as strings over JSON.
export interface Booking {
    _id: string,
    bookingCode: string,
    devoteeName: string,
    devoteePhone: string,
    city: string,
    address: string,
    ritualId: string,
    ritualName: string,
    ritualType: RitualType,
    panditId: string,
    panditName: string,
    date: string,
    timeSlot: TimeSlot,
    includeSamagriKit: boolean,
    totalAmount: number,
    status: BookingStatus,
    cancellationReason?: string,
    createdAt?: string,
    updatedAt?: string,
}

export interface OverviewData {
    rituals: Ritual[],
    pandits: Pandit[],
    bookings: Booking[]
}
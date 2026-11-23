

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function checkBackendHealth(): Promise<boolean> {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    return res.ok;
}
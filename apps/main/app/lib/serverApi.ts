import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL  ;

export async function serverApi(path: string, options: RequestInit = {}) {
    const cookie = await cookies();
    const token = cookie.get("access_token")?.value;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}

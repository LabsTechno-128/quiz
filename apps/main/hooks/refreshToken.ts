"use client";

export async function apiFetch(url: string, options: RequestInit = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // If access token expired
  if (res.status === 401) {
    const refresh = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      res = await fetch(url, {
        ...options,
        credentials: "include",
      });
    } else {
      throw new Error("Session expired");
    }
  }

  return res;
}
export class ClientApi {
  baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.thinkhive.net/api/v1/";
  }

  async request(
    method: string,
    url: string,
    data?: unknown,
    headers?: Record<string, string>,
  ) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const res = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || `Request failed: ${res.status}`);
    }

    return res.json();
  }

  get(url: string, headers?: Record<string, string>) {
    return this.request("GET", url, undefined, headers);
  }

  post(url: string, data?: unknown, headers?: Record<string, string>) {
    return this.request("POST", url, data, headers);
  }

  put(url: string, data?: unknown, headers?: Record<string, string>) {
    return this.request("PUT", url, data, headers);
  }

  delete(url: string, headers?: Record<string, string>) {
    return this.request("DELETE", url, undefined, headers);
  }
}

// export a single instance like axios.create()
export const clientApi = new ClientApi();

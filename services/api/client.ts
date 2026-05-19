export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { timeout = 15000, headers, ...rest } = init as any;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`https://pokeapi.co/api/v2${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    
    if (!res.ok) {
      throw new ApiError(res.statusText, res.status);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}
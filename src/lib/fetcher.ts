export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: { message?: string };
  };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message ?? "Request failed");
  }

  return payload.data as T;
}

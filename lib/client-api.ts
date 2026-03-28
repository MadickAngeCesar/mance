export type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
};

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
const LEGACY_TOKEN_KEYS = ["auth.accessToken", "auth_token"];

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  for (const key of [ACCESS_TOKEN_KEY, ...LEGACY_TOKEN_KEYS]) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return null;
}

function getStoredRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function persistAuthTokens(tokens: { accessToken: string; refreshToken?: string }) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function clearPersistedAuthTokens() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  for (const key of LEGACY_TOKEN_KEYS) {
    window.localStorage.removeItem(key);
  }
}

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

async function parseApiEnvelope<T>(response: Response): Promise<ApiEnvelope<T> | null> {
  return (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
}

async function refreshAccessToken() {
  const refreshToken = getStoredRefreshToken();

  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      refreshToken
        ? {
            refreshToken,
          }
        : {}
    ),
  });

  const payload = await parseApiEnvelope<{
    accessToken: string;
    refreshToken?: string;
  }>(response);

  if (!payload || !response.ok || !payload.ok || !payload.data?.accessToken) {
    throw new Error(payload?.error ?? "Unable to refresh session.");
  }

  persistAuthTokens({
    accessToken: payload.data.accessToken,
    refreshToken: payload.data.refreshToken,
  });

  return payload.data.accessToken;
}

export async function apiRequest<T>(
  input: string,
  options: ApiRequestOptions = {}
): Promise<ApiEnvelope<T>> {
  const { auth = false, headers, ...rest } = options;
  let authToken = auth ? getStoredToken() : null;

  const doRequest = (tokenOverride?: string) =>
    fetch(input, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(headers ?? {}),
        ...(tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : {}),
      },
    });

  let response = await doRequest(authToken ?? undefined);
  let payload = await parseApiEnvelope<T>(response);

  if (auth && response.status === 401) {
    try {
      authToken = await refreshAccessToken();
      response = await doRequest(authToken);
      payload = await parseApiEnvelope<T>(response);
    } catch {
      clearPersistedAuthTokens();
    }
  }

  if (!payload) {
    throw new Error("Unexpected server response.");
  }

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

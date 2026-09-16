import { TOKEN_KEYS, type Actor } from "./config";

/** Error carrying the HTTP status, so callers can branch on it. */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export const getToken = (actor: Actor): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEYS[actor]);
  } catch {
    return null; // private mode / blocked storage
  }
};

export const clearToken = (actor: Actor) => {
  try {
    localStorage.removeItem(TOKEN_KEYS[actor]);
  } catch {
    /* nothing to do */
  }
};

/** Where to send someone whose session has gone. */
const LOGIN_PATHS: Record<Actor, string> = {
  patient: "/patient/login",
  doctor: "/doctor/login",
  admin: "/admin/login",
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  /** Omit for public endpoints; set to attach that actor's bearer token. */
  actor?: Actor;
  signal?: AbortSignal;
  /** Milliseconds before the request is aborted. Default 15s. */
  timeoutMs?: number;
};

/**
 * One place where every API call goes.
 *
 * Replaces four hand-rolled copies of the same fetch wrapper. It adds what
 * none of them had: a timeout, a guard against a missing token, safe parsing
 * of non-JSON error bodies, and a single 401 path that clears the dead token
 * and returns the user to the right login page.
 */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, actor, signal, timeoutMs = 15000 } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (actor) {
    const token = getToken(actor);
    if (!token) {
      throw new ApiError("You are not signed in. Please log in again.", 401, "NO_TOKEN");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error)?.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", 0, "TIMEOUT");
    }
    throw new ApiError("Could not reach the server. Check your connection.", 0, "NETWORK");
  }
  clearTimeout(timer);

  // A 500 with an HTML body, or an empty 204, would make response.json() throw
  // and hide the real failure.
  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  // Error bodies are { message, code? }; success bodies are the endpoint's own
  // shape, asserted by the caller's type parameter.
  const errorBody = (data ?? {}) as { message?: string; code?: string };

  if (!response.ok) {
    if (response.status === 401 && actor) {
      clearToken(actor);
      // Full reload rather than a router navigate: this module has no router
      // context, and a hard reset is the right outcome for a dead session.
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
        window.location.assign(LOGIN_PATHS[actor]);
      }
    }
    throw new ApiError(
      errorBody.message || `Request failed (${response.status})`,
      response.status,
      errorBody.code
    );
  }

  return data as T;
}

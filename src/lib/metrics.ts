const API_BASE = (import.meta.env.VITE_METRICS_API as string | undefined) ?? ''

const POST_HEADERS = { 'Content-Type': 'application/json' }

/** Fire-and-forget event counter (e.g. `cta_click`). Never blocks the UI. */
export async function trackEvent(
  name: string,
  props: Record<string, string | number> = {}
): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/track`, {
      method: 'POST',
      headers: POST_HEADERS,
      keepalive: true,
      body: JSON.stringify({ name, props, path: window.location.pathname }),
    })
  } catch {
    // Analytics failures must never break the page.
  }
}

export type SignupResult = { ok: true; duplicate?: boolean } | { ok: false; error: string }

/** Stores a waitlist signup and reports validation/network problems to the form. */
export async function submitSignup(email: string, source = 'landing-cta'): Promise<SignupResult> {
  try {
    const res = await fetch(`${API_BASE}/api/signup`, {
      method: 'POST',
      headers: POST_HEADERS,
      body: JSON.stringify({ email, source, path: window.location.pathname }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string; duplicate?: boolean }
    if (!res.ok) {
      return { ok: false, error: data.error ?? 'Something went wrong. Please try again.' }
    }
    return { ok: true, duplicate: data.duplicate }
  } catch {
    return { ok: false, error: 'Network error. Please check your connection and try again.' }
  }
}

import { CheckResult, Service } from "./types";

/** How long to wait for a health response before treating it as down (ms) */
const TIMEOUT_MS = 8000;

/**
 * Probe a single service endpoint. A 2xx/3xx response (or any response that
 * isn't a network failure) counts as "up"; we report latency + status code.
 */
export async function checkService(
  service: Service,
  signal: AbortSignal,
): Promise<CheckResult> {
  const started = performance.now();
  try {
    const res = await fetch(service.url, {
      mode: "no-cors",
      signal,
      cache: "no-store",
    });
    // With no-cors the body/status is opaque; reaching here means the host
    // responded at the network level, which is the signal we care about.
    return { up: true, latency: Math.round(performance.now() - started) };
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      return { up: false, latency: TIMEOUT_MS };
    }
    return { up: false };
  }
}
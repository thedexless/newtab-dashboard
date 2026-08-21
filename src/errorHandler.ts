import { init, captureException, setTag } from "@sentry/browser";

const EXTENSION_URL_REPLACEMENTS: [RegExp, string][] = [
  [
    /moz-extension:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
    "resource://tabliss-extension",
  ],
  [
    /chrome-extension:\/\/hipekcciheckooncpjeljhnekcoolahp/g,
    "resource://tabliss-extension",
  ],
];

export function register(): void {
  init({
    autoSessionTracking: false, // Wtf sentry
    dsn: "https://2e0e75c7477c4c3e9572ee97241e569c@o113629.ingest.sentry.io/250221",
    enabled: !DEV,
    release: VERSION,
  });
  setTag("target", BUILD_TARGET);
}

export function capture(error: Error): void {
  if (error.stack) {
    error.stack = EXTENSION_URL_REPLACEMENTS.reduce(
      (stack, [pattern, replacement]) => stack.replace(pattern, replacement),
      error.stack,
    );
  }

  captureException(error);
}

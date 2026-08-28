import * as Sentry from "@sentry/react";

// Sentry is initialized in main.tsx — this module only adds the error
// handler integration (captureException + target tag).
export function register(): void {
  Sentry.setTag("target", BUILD_TARGET);
}

export function capture(error: Error): void {
  if (error.stack) {
    // Replace firefox extension URLs
    error.stack = error.stack.replace(
      /moz-extension:\/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
      "resource://tabliss-extension",
    );

    // Replace chrome extension URLs
    error.stack = error.stack.replace(
      /chrome-extension:\/\/hipekcciheckooncpjeljhnekcoolahp/g,
      "resource://tabliss-extension",
    );
  }

  Sentry.captureException(error);
}

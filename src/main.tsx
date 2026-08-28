import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { register as registerErrorHandler } from "./errorHandler";
import { register as registerServiceWorker } from "./serviceWorker";
import Root from "./views/Root";

// Sentry error monitoring. Public client DSN (can only submit events).
if (!DEV) {
  Sentry.init({
    dsn: "https://5c84ec187a6314ce7f3ad3c709d2ba00@o4511936499613696.ingest.de.sentry.io/4511946574528592",
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}

// Register error handler
if (!DEV) {
  registerErrorHandler();
}

// Render app into root element
createRoot(document.getElementById("root")!).render(<Root />);

// Register service worker on web
if (!DEV && BUILD_TARGET === "web") {
  registerServiceWorker();
}

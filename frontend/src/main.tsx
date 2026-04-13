import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import "./env";
import "./index.css";
import "./i18n/config";
import App from "./App.tsx";

import AuthProvider from "./contexts/auth/AuthProvider.tsx";
import { QueryProvider } from "./app/QueryProvider.tsx";
import { initSentry } from "./lib/sentry.ts";

initSentry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

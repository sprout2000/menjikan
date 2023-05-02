import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

import "@fontsource/chivo";
import { registerSW } from "virtual:pwa-register";

createRoot(document.getElementById("root") as Element).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerSW();

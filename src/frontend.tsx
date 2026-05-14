/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import DocsPage from "./DocsPage";

const elem = document.getElementById("root")!;
const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = pathname === "/docs" ? DocsPage : App;
const app = (
  <StrictMode>
    <Page />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);

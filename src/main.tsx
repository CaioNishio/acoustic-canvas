import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/sonar-system.css";

createRoot(document.getElementById("root")!).render(<App />);

// The static route fallback is emitted for crawlers that do not execute the
// SPA immediately. Remove it once React owns the page so users never see a
// duplicate version of the content.
document.getElementById("seo-fallback")?.remove();

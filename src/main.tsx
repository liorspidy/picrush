import { scan } from "react-scan";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { FirebaseProvider } from "./firebase/firebase.context.tsx";
import { registerSW } from 'virtual:pwa-register'

scan({
  enabled: true
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>
);

// Register PWA service worker
registerSW({
  onOfflineReady() {
    // console.log('✅ App ready to work offline');
  },
  onNeedRefresh() {
    // console.log('🔁 New version available');
  },
});
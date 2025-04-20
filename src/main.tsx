import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "./context/ConfigContext";
import { ThemeProvider } from "./components/ui/theme-provider";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <ConfigProvider>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

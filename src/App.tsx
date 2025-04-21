import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load admin routes for better performance
const AdminRoute = lazy(() => import("./pages/AdminRoute"));
const WidgetBuilder = lazy(() => import("./components/admin/WidgetBuilder"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/widget-builder" element={<WidgetBuilder />} />
          {/* Add additional routes here */}

          {/* Allow Tempo to capture routes before the catchall */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;

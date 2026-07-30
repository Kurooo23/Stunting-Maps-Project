import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import { useAuth } from "./lib/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import "./App.css";

// Rute-rute ini menyeret dependensi berat (Leaflet, react-leaflet,
// Supabase, dst) yang gak dibutuhkan halaman Login. Di-lazy-load supaya
// bundle awal (yang diunduh siapa pun yang buka "/") tetap kecil --
// Leaflet dkk baru diunduh saat kader benar-benar membuka /peta, /input,
// atau /digitize.
const MapPage = lazy(() => import("./components/MapPage"));
const InputPage = lazy(() => import("./components/InputPage"));
const DigitizerPage = lazy(() => import("./components/DigitizerPage"));

function RouteFallback() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Memuat...</p>
    </div>
  );
}

function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const showNavbar = Boolean(user) && location.pathname !== "/";

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <main className="app-body">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/digitize" element={<DigitizerPage />} />
            <Route
              path="/peta"
              element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/input"
              element={
                <ProtectedRoute>
                  <InputPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
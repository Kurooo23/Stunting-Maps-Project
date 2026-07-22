import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import { useAuth } from "./lib/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import MapPage from "./components/MapPage";
import InputPage from "./components/InputPage";
import DigitizerPage from "./components/DigitizerPage";
import "./App.css";

function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const showNavbar = Boolean(user) && location.pathname !== "/";

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <div className="app-body">
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
      </div>
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
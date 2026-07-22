import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export default function Navbar() {
  const { signOut } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Peta Stunting</h1>
        <span className="header-subtitle">Kelurahan Gunung Sari Ulu &mdash; Balikpapan</span>
      </div>
      <nav className="header-nav">
        <NavLink to="/peta" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
          Peta
        </NavLink>
        <NavLink to="/input" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Input Data
        </NavLink>
        <button type="button" className="nav-link nav-logout" onClick={signOut}>
          Keluar
        </button>
      </nav>
    </header>
  );
}
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Peta Stunting</h1>
        <span className="header-subtitle">Kelurahan Damai &mdash; Balikpapan</span>
      </div>
      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
          Peta
        </NavLink>
        <NavLink to="/input" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Input Data
        </NavLink>
      </nav>
    </header>
  );
}

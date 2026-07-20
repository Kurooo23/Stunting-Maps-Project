import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MapPage from "./components/MapPage";
import InputPage from "./components/InputPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="app-body">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/input" element={<InputPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Room from "./pages/Room";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:room" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;

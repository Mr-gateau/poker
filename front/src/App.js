import "./App.css";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Room from "./pages/Room";
import { useEffect, useState } from "react";
import axios from "axios";
import CreationAccount from "./pages/CreationAccount";
import "./styles/fill.css";

function App() {
  const [user, setUser] = useState(null);
  const [isAccounted, setIsAccounted] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("key");
    if (user === null && key) {
      axios
        .get("http://localhost:5000/user/" + key)
        .then((res) => {
          setIsAccounted(true);
          setUser(res.data);
        })
        .catch((err) => {
          localStorage.clear();
        });
    }
  });

  if (isAccounted) {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/:room" element={<Room user={user} />} />
        </Routes>
      </div>
    );
  } else {
    return <CreationAccount SetIsAccounted={setIsAccounted} />;
  }
}

export default App;

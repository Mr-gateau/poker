import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const socket = props.socket;
  const navigate = useNavigate();

  const generateRoom = () => {
    const roomName = (Math.random() + 1).toString(36).substring(7);
    console.log("create");

    axios
      .post("http://localhost:5000/createRoom", {
        user: props.user,
      })
      .then((res) => {
        console.log(res.data);
        navigate(`/${res.data.room}`);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  };

  return (
    <div>
      <button
        class="fill"
        style={{
          marginTop: "20%",
        }}
        onClick={() => generateRoom()}
      >
        Créer une partie
      </button>
    </div>
  );
};

export default Home;

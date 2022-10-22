import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
  const socket = props.socket;
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const generateRoom = () => {
    const roomName = (Math.random() + 1).toString(36).substring(7);
    console.log("create");
    socket.emit(
      // IDENTIFY BEIN ROOM ?
      "CreateRoom",
      roomName
    );

    navigate(`/${roomName}`);
  };

  return (
    <div>
      HOME
      <input type="text" onChange={(e) => setUserName(e.target.value)} />
      <button onClick={() => generateRoom()}>CREATE ROOM</button>
    </div>
  );
};

export default Home;

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const generateRoom = () => {
    const roomName = (Math.random() + 1).toString(36).substring(7);
    navigate(`/${roomName}`);
  };

  return (
    <div>
      HOME
      <button onClick={() => generateRoom()}>CREATE ROOM</button>
    </div>
  );
};

export default Home;

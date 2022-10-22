import { useParams } from "react-router-dom";
import socketIO from "socket.io-client";

const Room = () => {
  const socket = socketIO.connect("http://localhost:5000");
  const params = useParams();
  console.log("room", params.room);
  const numberSuite = [1, 2, 3, 4];

  const send = (numb) => {
    console.log("send", numb);
    socket.emit(
      "chat message",
      JSON.stringify({
        room: params.room,
        numb: numb,
      })
    );
  };

  return (
    <div>
      ROOM
      {numberSuite.map((numb) => (
        <button onClick={() => send(numb)}>{numb}</button>
      ))}
    </div>
  );
};

export default Room;

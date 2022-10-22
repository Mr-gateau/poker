import { useParams } from "react-router-dom";
import axios from "axios";

const Room = (props) => {
  const socket = props.socket;
  console.log(props);

  const params = useParams();
  const numberSuite = [1, 2, 3, 4];
  const send = (numb) => {
    socket.emit(
      // IDENTIFY BEIN ROOM ?
      "chat message",
      JSON.stringify({
        room: params.room,
        numb: numb,
      })
    );
  };
  console.log(socket);

  const newSession = () => {
    axios.get("http://localhost:5000/session/create/" + params.room);
  };

  const reveal = () => {
    axios.get("http://localhost:5000/room/reveal/" + params.room);
  };

  return (
    <div>
      {props.user.name}
      {numberSuite.map((numb) => (
        <button onClick={() => send(numb)}>{numb}</button>
      ))}
      <button onClick={() => newSession()}>Nouvelle session</button>
    </div>
  );
};

export default Room;

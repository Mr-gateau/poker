import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Room = (props) => {
  const socket = props.socket;
  console.log(props);

  const [isConnected, setIsconnected] = useState(false);
  const params = useParams();
  const numberSuite = [1, 2, 3, 4];
  const [roomInfo, setRoomInfo] = useState(null);

  console.log(isConnected);

  useEffect(() => {
    if (!isConnected) {
      axios
        .get(
          "http://localhost:5000/room/connect/" +
            params.room +
            "/" +
            props.user.key
        )
        .then((res) => {
          console.log("find and true");
          setIsconnected(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("here ? ");
      axios.get("http://localhost:5000/room/" + params.room).then((res) => {
        console.log("data", res.data);
        setRoomInfo(res.data);
      });
    }
  }, [isConnected]);

  const newSession = () => {
    axios.get("http://localhost:5000/session/create/" + params.room);
  };

  const reveal = () => {
    console.log("REVEAL");
    axios
      .get("http://localhost:5000/room/reveal/" + params.room)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const vote = (number) => {
    axios
      .get(
        "http://localhost:5000/vote/" +
          params.room +
          "/" +
          props.user.key +
          "/" +
          number
      )
      .then((res) => console.log(res));
  };

  const restart = () => {
    axios
      .get("http://localhost:5000/restart/" + params.room)
      .then((res) => console.log("ok"))
      .catch((err) => console.log(err));
  };
  if (roomInfo) {
    return (
      <div>
        {props.user.name}

        {roomInfo.hasVoted &&
        Object.values(roomInfo.hasVoted).length > 0 &&
        roomInfo.hasVoted[props.user.key] ? (
          <>Voted</>
        ) : (
          numberSuite.map((numb, i) => (
            <button
              key={i}
              onClick={() => {
                vote(numb);
              }}
            >
              {numb}
            </button>
          ))
        )}

        {roomInfo.visible && (
          <div>
            {roomInfo.votes.map((v) => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p>{Object.values(v)[0].name}</p>:
                <p>{Object.values(v)[0].value}</p>
              </div>
            ))}
          </div>
        )}

        {roomInfo.users.map((user) => (
          <p>{user.name}</p>
        ))}

        {roomInfo.visible ? (
          <button onClick={() => restart()}>restart!</button>
        ) : (
          <button onClick={() => reveal()}>Reveal!</button>
        )}
      </div>
    );
  } else {
    return <>Wait...</>;
  }
};

export default Room;

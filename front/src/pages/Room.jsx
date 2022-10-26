import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Room = (props) => {
  const socket = props.socket;
  console.log(props);

  const [isConnected, setIsconnected] = useState(false);
  const params = useParams();
  const numberSuite = [1, 2, 3, 5, 8, 13, 21];
  const [roomInfo, setRoomInfo] = useState(null);
  const [isLoad, setIsload] = useState(true);
  const [isOwner, setIsowner] = useState(false);

  useEffect(() => {
    if (roomInfo) {
      if (roomInfo.owner.indexOf(props.user.key) > -1) {
        return setIsowner(true);
      } else {
        console.log("false");
        return setIsowner(false);
      }
    }
  });

  useEffect(() => {
    if (isLoad) {
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
          setIsload(false);
        });
      }
    }
  }, [isConnected]);

  const reveal = () => {
    console.log("REVEAL");
    axios
      .get("http://localhost:5000/room/reveal/" + params.room)

      .then((res) => setIsload(true))
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
      .then((res) => setIsload(true))
      .catch((err) => console.log(err));
  };

  console.log("isown", isOwner);

  const restart = () => {
    axios
      .get("http://localhost:5000/restart/" + params.room)
      .then((res) => setIsload(true))
      .catch((err) => console.log(err));
  };
  if (roomInfo) {
    return (
      <div>
        <h5>{props.user.name}</h5>
        <div className="cardBox">
          {roomInfo.hasVoted &&
          Object.values(roomInfo.hasVoted).length > 0 &&
          roomInfo.hasVoted[props.user.key] ? (
            <>Voted</>
          ) : (
            numberSuite.map((numb, i) => (
              <div
                className="card"
                key={i}
                onClick={() => {
                  vote(numb);
                }}
              >
                {numb}
              </div>
            ))
          )}
        </div>

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
        <div>
          <h4>Liste des joueurs</h4>
          <div
            style={{
              padding: "20px",
              border: "solid 1px",
              width: "40%",
              margin: "auto",
            }}
          >
            {roomInfo.users.map((user) => (
              <p>{user.name}</p>
            ))}
          </div>

          {isOwner && (
            <>
              {roomInfo.visible ? (
                <button
                  className="fill"
                  style={{ marginTop: "30px" }}
                  onClick={() => restart()}
                >
                  restart!
                </button>
              ) : (
                <button
                  className="fill"
                  style={{ marginTop: "30px" }}
                  onClick={() => reveal()}
                >
                  Reveal!
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  } else {
    return <>Wait...</>;
  }
};

export default Room;

import axios from "axios";
import { useState } from "react";

const CreationAccount = (props) => {
  const [name, setName] = useState("");

  const send = () => {
    axios
      .post("http://localhost:5000/user/create/", {
        key: (Math.random() + 1).toString(36).substring(7),
        name: name,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("key", res.data.key);
        props.SetIsAccounted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{
        width: "50%",
        margin: "auto",
        marginTop: "20%",
      }}
    >
      <h4>Entrez votre nom :</h4>
      <input
        style={{
          width: "100%",
          padding: "20px",
        }}
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      {name.length > 3 && (
        <button class="fill" onClick={() => send()}>
          Connect
        </button>
      )}
    </div>
  );
};

export default CreationAccount;

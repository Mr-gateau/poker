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
    <div>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      {name.length > 3 && <button onClick={() => send()}>Connect</button>}
    </div>
  );
};

export default CreationAccount;

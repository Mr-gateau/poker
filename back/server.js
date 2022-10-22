const express = require("express");
const app = express();
const port = 5000;
const http = require("http").Server(app);

const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/:room", (req, res) => {
  // ADD websocket ici
  console.log("here");
  res.status(200);
});

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

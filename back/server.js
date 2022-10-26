const express = require("express");
const app = express();
const port = 5000;
const http = require("http").Server(app);
const mongoose = require("mongoose");
const Room = require("./schema/room");
const User = require("./schema/user");
const Session = require("./schema/session");
const bodyParser = require("body-parser");
require("dotenv").config();

console.log(process.env.MONGO);
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée ! ", error));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user/create", async (req, res) => {
  try {
    console.log(req.body.key);
    const user = await User.create({
      key: req.body.key,
      name: req.body.name,
    });
    console.log(user);
    res.status(201).send({ key: user.key });
  } catch (err) {
    console.log(err);
  }
});

app.get("/room/reveal/:room/", async (req, res) => {
  try {
    const room = await Room.findOne({ room: req.params.room });

    room.visible = true;
    room.save();
    res.status(200).json({ message: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ key: req.params.id });
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.get("/vote/:room/:user/:vote", async (req, res) => {
  try {
    const room = await Room.findOne({ room: req.params.room });
    const user = await User.findOne({ key: req.params.user });
    room.votes.push({
      [req.params.user]: { value: req.params.vote, name: user.name },
    });
    room.hasVoted = {
      ...room.hasVoted,
      [req.params.user]: true,
    };
    room.save();
    res.status(200).json({ mess: "ok" });
  } catch (err) {
    res.status(500);
  }
});

app.get("/restart/:room", async (req, res) => {
  const room = await Room.findOne({ room: req.params.room });

  room.votes = [];
  room.visible = false;
  room.hasVoted = {};

  room.save();

  res.status(200).json({ mess: "ok" });
});

app.get("/room/connect/:room/:user", async (req, res) => {
  try {
    const room = await Room.findOne({ room: req.params.room });
    const user = await User.findOne({ key: req.params.user });
    let found = false;
    for (let i = 0; i < room.users.length; i++) {
      console.log(room.users[i].key);
      console.log(req.params.user);
      if (room.users[i].key === req.params.user) {
        found = true;
      }
    }

    if (!found) {
      const newUsers = room.users;
      newUsers.push({ key: user.key, name: user.name });
      room.user = newUsers;
      room.save();
    }

    res.status(200).json({ message: "you added" });
  } catch (err) {
    console.log("err", err);
    res.status(500);
  }
});

app.post("/createRoom", async (req, res) => {
  // Create room with user is owner:
  console.log(req.body.user);
  const user = await User.findOne({ key: req.body.user.key });
  const room = await Room.create({
    room: (Math.random() + 1).toString(36).substring(7),
    owner: [req.body.user.key],
    visible: false,
    votes: [],
    hasVoted: {},
    users: [{ key: req.body.user.key, name: user.name }],
    owner: [req.body.user.key],
  });

  res.status(201).json({ room: room.room });
});

app.get("/room/:room", async (req, res) => {
  const room = await Room.findOne({
    room: req.params.room,
  });

  if (!room.visible) {
    room.votes = [];
  }
  console.log(room);

  res.status(200).json(room);
});

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Add this before the app.get() block
/*
socketIO.on("connection", async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  const createUser = await User.create({
    key: socket.id,
    owner: false,
  });
  socket.on("disconnect", async () => {
    console.log("🔥: A user disconnected");
    const deleteUser = await User.deleteOne({ key: socket.id });
  });

  socket.on("CreateRoom", async (room) => {
    console.log("room created", room);
    // Create room in DB
    const newRoom = await Room.create({
      room: room,
      visible: false,
      vote: [],
    });
    const user = await User.updateOne({ key: socket.id }, { owner: true });
  });
});
*/
http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

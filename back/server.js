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

app.post("/create", async (req, res) => {
  try {
    console.log(req.body.key);
    const user = await User.create({
      key: req.body.key,
      name: req.body.name,
      owner: false,
    });
    console.log(user);
    res.status(201).send({ key: user.key });
  } catch (err) {
    console.log(err);
  }
});

app.get("/session/create/:room", async (req, res) => {
  //Add session

  try {
    const session = await Session.create({
      name: (Math.random() + 1).toString(36).substring(7),
    });

    const room = await Room.updateOne(
      { key: req.params.room },
      { actualSession: session.name }
    );
  } catch (err) {
    res.status(500);
  }
});

app.get('/room/reveal', async (req, res) => {

  // change to reveal add session in reveal.
  const room = await Room.updateOne({}, {})

})

app.get("/user/:id", async (req, res) => {
  console.log("here");
  try {
    const user = await User.findOne({ key: req.params.id });
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.post("/createRoom", async (req, res) => {});

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Add this before the app.get() block
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

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const MESSAGE_EVENT = 'FromAPI';
const PLAY_NOTE_EVENT = 'PlayNote';

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://192.168.1.193:3031",
    methods: ["GET", "POST"]
  }
});

//let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
//  if (interval) {
//    clearInterval(interval);
//  }
//  interval = setInterval(() => getApiAndEmit(socket), 200);
  socket.on(MESSAGE_EVENT, (data) => {
    console.log("New message received: " + data.message);
    io.sockets.emit(MESSAGE_EVENT, data);
  });

  socket.on(PLAY_NOTE_EVENT, (data) => {
    console.log("New note received");
    console.log(data);
    io.sockets.emit(PLAY_NOTE_EVENT, data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
//    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

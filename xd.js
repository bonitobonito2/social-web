const io = require("socket.io-client");

const socket = io("http://localhost:4500");

socket.on("connect", (user) => {
  // console.log("Connected to server!");
  // socket.emit("message", "Hello from client!");
  socket.emit("message", "zaali");
});

socket.on("message", (msg) => {
  console.log(`Received message: ${msg}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server!");
});

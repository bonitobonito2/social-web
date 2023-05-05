const io = require("socket.io-client");
const socket = io.connect("http://localhost:4500");

// listen for the 'connect' event
socket.on("connect", () => {
  console.log("Connected to the server!");
});

// listen for the 'message' event
socket.on("message", (data) => {
  console.log(`Received message: ${data.sent}`);
});

// send a message to the server
socket.emit("message", "Hello from the client!");

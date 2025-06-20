const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const avatarMessages = [
  "Hello! I'm here to help you with your coding questions.",
  "Here's what your function is doing wrong...",
  "Let me explain this concept step by step.",
  "Great work! Your implementation looks good.",
  "I notice there's a potential issue with your logic here.",
  "This approach could be optimized for better performance.",
  "Don't worry, debugging is part of the learning process!",
  "Let's work through this problem together.",
];

let messageIndex = 0;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send a welcome message
  setTimeout(() => {
    socket.emit("AVATAR_TALK", {
      type: "AVATAR_TALK",
      text: "Welcome! I'm connected and ready to help.",
    });
  }, 1000);

  // Send periodic AVATAR_TALK messages
  const messageInterval = setInterval(() => {
    const message = avatarMessages[messageIndex % avatarMessages.length];
    socket.emit("AVATAR_TALK", {
      type: "AVATAR_TALK",
      text: message,
    });
    messageIndex++;
    console.log(`Sent message: ${message}`);
  }, 10000); // Send every 10 seconds

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    clearInterval(messageInterval);
  });

  // Handle custom events
  socket.on("request_message", (data) => {
    console.log("Received request for message:", data);
    socket.emit("AVATAR_TALK", {
      type: "AVATAR_TALK",
      text: `You requested: ${data.message || "a custom message"}`,
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log("Sending AVATAR_TALK messages every 10 seconds...");
});

module.exports = { io, server };

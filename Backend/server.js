const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const walletRoutes = require("./src/routes/walletRoutes");
const http = require("http"); // Import Node's http module
const socketIO = require("socket.io");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_DEV,
    credentials: true,
    //optionSuccessStatus:200
  })
);

// route
app.use("/api", walletRoutes);

//
const server = http.createServer(app);
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("a user connected");

  // Your WebSocket event handling here

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Listen on the HTTP server, not the express app
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = { io };

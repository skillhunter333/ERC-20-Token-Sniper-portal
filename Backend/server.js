const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const walletRoutes = require("./src/routes/walletRoutes");
const http = require("http"); // Import Node's http module
const { io, userSocketMap, socketUserMap } = require('./io');


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
app.options('*', cors()); // This will allow preflight checks for all routes

// route
app.use("/api", walletRoutes);

//
const server = http.createServer(app);
io.attach(server, {
  cors: {
    origin: process.env.FRONTEND_DEV, 
    credentials: true 
  }
});

io.on('connection', (socket) => {
  socket.on('register-user', (userId) => {
    userSocketMap.set(userId, socket.id);
    socketUserMap.set(socket.id, userId); 
  });

  socket.on('disconnect', () => {
    const userId = socketUserMap.get(socket.id);
    if (userId) {
      userSocketMap.delete(userId);
      socketUserMap.delete(socket.id);
    }
  });
  });


  io.on('connect_error', (error) => {
  console.error('Connection Error:', error);
});

io.on('connect_timeout', (timeout) => {
  console.error('Connection Timeout:', timeout);
});


// Listen on the HTTP server, not the express app
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = { io };

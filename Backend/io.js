const { Server } = require("socket.io");
const io = new Server({
  transports: ['websocket'], // Force the WebSocket transport only
}); 

const userSocketMap = new Map();
const socketUserMap = new Map();



module.exports = { io, userSocketMap, socketUserMap };



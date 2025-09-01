import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './src/Action.js';
import { fileURLToPath } from "url";
import path, { dirname }  from "path";


const app = express();
const server = http.createServer(app);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "dist")));
app.use((req,res,next)=> {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// app.get('*', (req,res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });
const io = new Server(server, {
  cors: {
    origin: '*', // yaha par frontend ka origin allow kar
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

const userSocketMap = {};

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    })
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN,({roomId, username})=>{
             userSocketMap[socket.id] = username;
             socket.join(roomId);
             console.log()
             const clients = getAllConnectedClients(roomId);

             clients.forEach(({socketId})=>{
                  io.to(socketId).emit(ACTIONS.JOINED,{  //ACTION
                    clients,
                    username,
                    socketId: socket.id,
                  });
             })
  });

  socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
     socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{ code });
  });
    
  socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
     io.to(socketId).emit(ACTIONS.CODE_CHANGE,{ code });
  });
    

  socket.on('disconnecting',()=>{
      const rooms = [...socket.rooms];
      rooms.forEach((roomId)=>{
        socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
            socketId: socket.id,
            username: userSocketMap[socket.id],
        });
      });

      delete userSocketMap[socket.id];
      socket.leave();
  });
});

server.listen(PORT, () => {
  console.log(`server is on ${PORT}`);
});

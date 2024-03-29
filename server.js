const express = require("express");
const path = require("path");
const socketio=require("socket.io");
const http=require("http");
const formatMessage=require("./utils/messages");
const {getCurrentUser,userLeave,getRoomUsers}=require('./utils/userFunctions')
const userJoin=require('./utils/users')


const app=express();
const server=http.createServer(app);
const io=socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname,"public")));

const botName="ChatCord Bot";

//Run when a client connects
io.on('connection',socket=>{
    console.log("New Web Socket Connection");

  
  socket.on("joinRoom",({username,room})=>{
  
    console.log("Entered Join Room");
    
    

    const user=userJoin(socket.id,username,room); 
    socket.join(user.room);

    //Welcome current user
    socket.emit("message",formatMessage(botName,"Welcome to ChatCord"));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username} has joined the chat`));

    //Send users and room info
    io.to(user.room).emit("roomUsers",{
        room:user.room,
        users:getRoomUsers(user.room)
    })


  });
    

    //Listen for chatMessage
    socket.on("chatMessage",(msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit("message",formatMessage(user.username,msg));
    });

    //Runs when client disconnects
    socket.on("disconnect",()=>{
        const user=userLeave(socket.id);
        io.emit("message",formatMessage(botName,`${user.username} has left the chat`));
        
        //Send users and room info
        io.to(user.room).emit("roomUsers",{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    });
    
})


const PORT=3000||process.env.PORT;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})


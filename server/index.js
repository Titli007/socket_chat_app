const express = require('express')
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

app.use(cors())

const PORT = process.env.PORT || 4000
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET","POST"]
    }
})

io.on("connection", (socket)=>{
    console.log("user connected: ", socket.id);

    socket.on("join_room", (data)=>{
        console.log("user connected:", socket.id, "join the room:", data);
        socket.join(data);
        console.log("User joined room:", data);
    });
    
    socket.on("send_message", (data)=>{
        console.log("Received message:", data);
        socket.to(data.roomID).emit("receive_message", data);
        console.log("Sent message to room:", data.roomID);
    });
    


    socket.on("disconnect", ()=>{
        console.log("user disconnected", socket.id)
    })
})

server.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`)
})


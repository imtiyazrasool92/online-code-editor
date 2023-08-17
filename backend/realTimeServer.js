
const io = require("socket.io")(2000,{
    cors : {
        orgin : ['http://localhost:3000/']
    }
})

io.on("connection",(socket)=>{
    socket.on("send_code",(value,id)=>{
        socket.to(id).emit("take_code",value)
    })
    socket.on('send_input',(value,id)=>{
        socket.to(id).emit("take_input",value)
    })
    socket.on('send_language',(value,id)=>{
        socket.to(id).emit("take_language",value)
    })

    socket.on("join",(id)=>{
        socket.join(id)
    })
})
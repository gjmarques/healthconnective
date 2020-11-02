const express = require('express')
const http = require('http')
const app = express()

const server = http.createServer(app)
const io = require('socket.io')(server)

const port = 8008

app.use(express.static(__dirname+'/public'))
io.sockets.on('error', e => console.log(e))
server.listen(port, () => console.log('Server is up'))

let broadcast

io.sockets.on('connection', socket => {
    socket.on('broadcaster', () => {
        broadcast = socket.id;
        socket.broadcast.emit('broadcaster')
    })
    socket.on('watcher', () => {
        socket.to(broadcast).emit('watcher', socket.id)
    })
    socket.on('disconnect', () => {
        socket.to(broadcast).emit('disconnectPeer', socket.id)
    })
    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });
    socket.on("answer", (id, message) => {
      socket.to(id).emit("answer", socket.id, message);
    });
    socket.on("candidate", (id, message) => {
      socket.to(id).emit("candidate", socket.id, message);
    });
})

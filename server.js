const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));

let players = {};

io.on('connection', (socket) => {
    console.log('Player connected: ' + socket.id);
    players[socket.id] = { x: 100, y: 400, id: socket.id };
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('disconnectPlayer', socket.id);
    });

    socket.on('playerMovement', (movementData) => {
        if(players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });
});

http.listen(3000, () => { console.log('Server running on port 3000'); });

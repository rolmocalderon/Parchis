// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const Game = require('./static/Server/Game');
const Constants = require('./static/lib/Constants');

const FRAME_RATE = 1000 / 60;
const game = new Game();

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Get player colors
app.get('/colors', function (request, response) {
    response.send(game.colors);
});

// Starts the server.
server.listen(5000, function () {
    console.log('Started server on port 5000');
});

io.on('connection', socket => {
    socket.on(Constants.SOCKET_NEW_PLAYER, (data, callback) => {
        game.AddNewPlayer(data.name, socket, data.color);
        //callback();
    });

    socket.on(Constants.SOCKET_PLAYER_ACTION, data => {
        game.PlayerMovedPiece(socket.id, data);
    });

    socket.on(Constants.SOCKET_DISCONNECT, () => {
        console.log("User disconnected");
        game.RemovePlayer(socket.id);
    });
});

setInterval(() => {
    game.Update();
    game.SendState();
}, FRAME_RATE);
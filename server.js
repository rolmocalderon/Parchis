// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser')

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const Game = require('./static/Server/Game');
const Constants = require('./static/lib/Constants');

const game = new Game();

app.set('port', 5000);
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (request, response) {
      // Cookies that have not been signed
    if(!IsCookie(request)){
        response.cookie("Parchis", {'game':game.players});
    }
 
    console.log(request.cookies.Parchis);
    response.sendFile(path.join(__dirname, 'test.html'));
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
        const player = game.AddNewPlayer(data.player.name, socket, data.player.color);
        console.log("User connected");
        if(callback) callback(player);

        if(game.players.size > 0){
            game.SendState();
        }else{
            console.log('numero de jugadores:',game.players.size)
        }
    });

    socket.on(Constants.SOCKET_PLAYER_ACTION, data => {
        game.PlayerMovedPiece(socket.id, data);
    });

    socket.on(Constants.SOCKET_DISCONNECT, () => {
        game.RemovePlayer(socket.id);
        console.log("User disconnected");
    });
});

/*setInterval(() => {
    game.Update();
    game.SendState();
}, Constants.GAME_CONFIG_FRAME_RATE);*/

function IsCookie(request) {
    return Object.keys(request.cookies).length !== 0;
}
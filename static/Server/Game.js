const Player = require('./Player');
const Constants = require('../lib/Constants');

class Game {
    constructor(){
        this.clients = new Map();
        this.players = new Map();
        this.lastUpdateTime = null;
        this.slots = null;
        this.colors = {
            'red': {
                'owner': null,
                'home': 1
            },
            'blue': {
                'owner': null,
                'home': 2
            },
            'yellow': {
                'owner': null,
                'home': 3
            },
            'green': {
                'owner': null,
                'home': 4
            }
        };
    };

    static Create(){
        const game = new Game();
        game.Init();
        return game;
    };

    Init() {
        this.lastUpdateTime = Date.now();
    };

    AddNewPlayer(name, socket, color) {
        this.clients.set(socket.id, socket);
        this.colors[color].owner = name;
        const player = Player.Create(name, socket.id, this.colors[color]);
        this.players.set(socket.id, player);
    };

    RemovePlayer(socketID) {
        if (this.clients.has(socketID)) {
          this.clients.delete(socketID);
        }

        if (this.players.has(socketID)) {
          const player = this.players.get(socketID);
          this.players.delete(socketID);
          return player;
        }
    };

    PlayerMovedPiece(socketID, data){
        const player = this.players.get(socketID)
        if (player) {
            player.MovePiece(data);
        }
    };

    Update() {
        this.lastUpdateTime = Date.now();
    };

    SendState() {
        const players = [...this.players]
        
        this.clients.forEach((client, socketID) => {
          const currentPlayer = this.players.get(socketID);
          console.log(players);
          this.clients.get(socketID).emit(Constants.SOCKET_UPDATE, {
            self: currentPlayer,
            players: players
          });
        });
      }
};

module.exports = Game;
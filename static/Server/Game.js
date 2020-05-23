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
                'color': 'red'
            },
            'blue': {
                'owner': null,
                'color': 'blue'
            },
            'yellow': {
                'owner': null,
                'color': 'yellow'
            },
            'green': {
                'owner': null,
                'color': 'green'
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
        if (!this.players.has(socket.id)) {
            this.clients.set(socket.id, socket);
            this.colors[color].owner = name;
            const player = Player.Create(name, socket.id, color);
            this.players.set(socket.id, player);

            return player;
        }
    };

    RemovePlayer(socketID) {
        if (this.clients.has(socketID)) {
          this.clients.delete(socketID);
        }

        if (this.players.has(socketID)) {
          const player = this.players.get(socketID);
          this.players.delete(socketID);
          this.colors[player.color].owner = null;
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
          this.clients.get(socketID).emit(Constants.SOCKET_START_GAME, {
            self: currentPlayer,
            players: players
          });
        });
      }
};

module.exports = Game;
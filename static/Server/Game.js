const Player = require('./Player');
const Constants = require('../lib/Constants');

class Game {
    constructor(){
        this.clients = new Map();
        this.players = new Map();
        this.lastUpdateTime = null;
        this.slots = null;
        this.status = Constants.GAME_STATUS_NOT_STARTED;
        this.colors = {
            'Red': {
                'owner': null,
                'color': 'Red'
            },
            'Blue': {
                'owner': null,
                'color': 'Blue'
            },
            'Yellow': {
                'owner': null,
                'color': 'Yellow'
            },
            'Green': {
                'owner': null,
                'color': 'Green'
            }
        };
        this.dieces = {
            'dieceOne': 0,
            'dieceTwo': 0,
            'diecesSum': 0
        }
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
        console.log("has",this.players.has(socket.id))
        if (!this.players.has(socket.id)) {
            console.log('socket',socket.id)
            this.clients.set(socket.id, socket);
            console.log(color,'color');
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

        let self = this;
        this.players.forEach(function(x){
            console.log(socketID)
            if(x.socketID === socketID) return;
            console.log('ejeme',x);
            let selfSocket = self.clients.get(socketID);
            if(selfSocket !== null){
                selfSocket.emit(Constants.SOCKET_ACTION_PIECE_MOVED, {
                    selectedPieceId: data.selectedPieceId,
                    fieldId: data.fieldId
                });
            }else{
                console.error("socket erróneo",selfSocket);
            }
        });
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

        console.log("SEND STATE");
        this.status = Constants.GAME_STATUS_PLAYING;
      }

      ThrowDieces() {
        this.dieces.dieceOne = Math.floor(Math.random() * Math.floor(6)) + 1;
        this.dieces.dieceTwo = Math.floor(Math.random() * Math.floor(6)) + 1;
        this.dieces.diecesSum = this.dieces.dieceOne + this.dieces.dieceTwo;

        return this.dieces;
      }
};

module.exports = Game;
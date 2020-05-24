const Constants = require('../lib/Constants');

class Game {
    constructor(socket) {
        this.socket = socket;
        this.players = [];
        this.lastUpdateTime = 0;
        this.self = null;
        this.colors = null;
        this.selectedPiece = null;
        this.fields = [];
        this.canMove = false;
        this.dieces = {
            'dieceOne': 5,
            'dieceTwo': 3
        }
    };

    static Create(socket) {
        const game = new Game(socket);
        game.Init();
        return game;
    };

    Init() {
        this.lastUpdateTime = Date.now();
        this.socket.on(Constants.SOCKET_START_GAME, this.UpdateGameState.bind(this));
        document.addEventListener(Constants.SOCKET_ACTION_MOVE_PIECE,this.Update.bind(this));
        document.addEventListener(Constants.SOCKET_ACTION_THROW_DIECES,this.ThrowDieces.bind(this));
    };

    UpdateGameState(request) {
        this.self = request.self
        this.players = request.players;
        document.dispatchEvent(new CustomEvent(Constants.SOCKET_START_GAME, {
            detail: { 'players': this.players, 'self': this.self }
        }));
    };

    Run() {
        this.lastUpdateTime = Date.now();
        this.Update();
    };

    Update(data) {
        this.lastUpdateTime = Date.now();
        if (this.self) {
            this.self = data.detail.self;
            this.socket.emit(Constants.SOCKET_ACTION_MOVE_PIECE);
        }
    };

    ThrowDieces(data) {
        let callback = data.detail.callback;
        this.socket.emit(Constants.SOCKET_ACTION_THROW_DIECES,{'data':'1234'},callback);
    }
};

module.exports = Game;
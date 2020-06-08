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
        this.status = null;
        this.dieces = {};
    };

    static Create(socket) {
        const game = new Game(socket);
        game.Init();
        return game;
    };

    Init() {
        this.lastUpdateTime = Date.now();
        this.socket.on(Constants.SOCKET_START_GAME, this.StartGame.bind(this));
        this.socket.on(Constants.SOCKET_ACTION_PIECE_MOVED,this.UpdateGameState.bind(this));
        
        document.addEventListener(Constants.SOCKET_ACTION_MOVE_PIECE,this.MovePiece.bind(this));
        document.addEventListener(Constants.SOCKET_ACTION_THROW_DIECES,this.ThrowDieces.bind(this));
    };

    StartGame(request) {
        this.self = request.self
        this.players = request.players;
        document.dispatchEvent(new CustomEvent(Constants.SOCKET_START_GAME, {
            detail: { 'players': this.players, 'self': this.self }
        }));
    };

    UpdateGameState(request){
        document.dispatchEvent(new CustomEvent(Constants.SOCKET_ACTION_PIECE_MOVED, {
            selectedPieceId: request.selectedPieceId,
            fieldId: request.fieldId
        }));
    };

    Run() {
        this.lastUpdateTime = Date.now();
        this.Update();
    };

    MovePiece(data) {
        this.lastUpdateTime = Date.now();
        if (this.self) {
            let fieldId = data.detail.fieldId;
            let selectedPieceId = this.selectedPiece.id;
            this.socket.emit(Constants.SOCKET_ACTION_MOVE_PIECE, {
                fieldId,selectedPieceId
            });
        }
    };

    ThrowDieces(data) {
        let callback = data.detail.callback;
        this.socket.emit(Constants.SOCKET_ACTION_THROW_DIECES,{'data':'1234'},callback);
    }
};

module.exports = Game;
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
    };

    static Create(socket) {
        const game = new Game(socket);
        game.Init();
        return game;
    };

    Init() {
        this.lastUpdateTime = Date.now();
        this.socket.on(Constants.SOCKET_UPDATE, this.UpdateGameState.bind(this));
        document.addEventListener(Constants.SOCKET_PLAYER_ACTION,this.Update.bind(this));
    };

    UpdateGameState(request) {
        this.self = request.self
        this.players = request.players;
        document.dispatchEvent(new CustomEvent(Constants.SOCKET_REFRESH, {
            detail: { 'players': this.players, 'self': this.self }
        }));
    };

    Run() {
        this.lastUpdateTime = Date.now();
        this.Update();
    };

    Update(event, data) {
        this.lastUpdateTime = Date.now();
        if (this.self) {
            this.self = data.detail.self;
            this.socket.emit(Constants.SOCKET_PLAYER_ACTION)
        }
    };
};

module.exports = Game;
const Constants = require('../lib/Constants');

class Game {
    constructor(socket) {
        this.socket = socket;
        this.players = [];
        this.lastUpdateTime = 0;
        this.self = null;
    };

    static Create(socket) {
        const game = new Game(socket);
        game.Init();
        return game;
    };

    Init() {
        this.lastUpdateTime = Date.now();
        this.socket.on(Constants.SOCKET_UPDATE, this.UpdateGameState.bind(this));
    };

    UpdateGameState(state) {
        this.self = state.self
        this.players = state.players;
        document.dispatchEvent(new CustomEvent(Constants.SOCKET_REFRESH, {
            detail: { 'players': this.players, 'self': this.self }
        }));
    };

    Run() {
        this.lastUpdateTime = Date.now();
        this.update();
    };

    Update() {
        if (this.self) {
            this.socket.emit(Constants.SOCKET_PLAYER_ACTION)
        }
    };
};

module.exports = Game;
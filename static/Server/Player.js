const Constants = require('../lib/Constants');

class Player {
    constructor(name,socketID,color){
        this.name = name;
        this.socketID = socketID;
        this.lastUpdateTime = null;
        this.color = color;
        this.pieces = [];
    };

    static Create(name, socketID,color) {
        const player = new Player(name, socketID, color);
        player.InitPieces();
        return player;
    };

    InitPieces() {
        for(let i=0; i < 4; i++)
        {
            this.pieces.push({
                'id': i,
                'state': Constants.PIECE_STATE_HOME,
                'position': 0
            });
        }
    };

    MovePiece(data) {
        const piece = this.pieces.filter(piece => piece.id = data.piece.id);
        piece.state = data.piece.state;
        piece.position = data.piece.position;
    };
};

module.exports = Player;
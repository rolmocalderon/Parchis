const Constants = require('../lib/Constants');
const Piece = require('../Server/Piece');

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
        player.lastUpdateTime = new Date();

        return player;
    };

    InitPieces() {
        for(let i=0; i < 4; i++)
        {
            this.pieces.push(new Piece(i,Constants.PIECE_STATE_HOME,false));
        }
    };

    MovePiece(data) {
        console.log(data);
        const piece = this.pieces.filter(piece => piece.id = data.selectedPieceId);
        piece.position = data.fieldId;
    };
};

module.exports = Player;
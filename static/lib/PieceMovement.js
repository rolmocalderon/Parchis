const Constants = require('./Constants');

module.exports = {
    GetAccesibleFields: function(incomingPiece,game) {
        const state = incomingPiece.parentElement.getAttribute('name');
        const color = incomingPiece.getAttribute('color');
        
        if(state === Constants.PIECE_STATE_HOME){
            let canLeaveHome = Object.values(game.dieces).some(x => x == Constants.DIECES_START_VALUE);
            let field = game.fields.find(field => field.state == Constants.PIECE_STATE_START && field.color == color);
            let fieldElement = document.querySelectorAll('#' + field.id);
            if(canLeaveHome && !this.MaxNumPiecesInFieldValidation(fieldElement[0])){
                return fieldElement;
            }
        }else{
            let field = incomingPiece.parentElement;
            let currentFieldNum = parseInt(field.id.split(Constants.PIECE_STATE_FIELD)[1]);
            let diecesSum = Object.values(game.dieces).reduce((accumulator, currentValue) => accumulator + currentValue);
            let requestedFieldNum = diecesSum + currentFieldNum;
            requestedFieldNum = requestedFieldNum > 68 ? requestedFieldNum - 68  : requestedFieldNum;

            if(this.EntranceToSpecialZoneValidation(requestedFieldNum,currentFieldNum,color)){
                console.log("YEAH");
            }

            return document.querySelectorAll('#' + Constants.PIECE_STATE_FIELD + requestedFieldNum);
        }
    },
    ValidateMovement: function(field,incomingPiece) {
        if(!this.MaxPieceCountInFieldValidation(field)) return false;

        const state = field.getAttribute('name');
        switch (state) {
            case Constants.PIECE_STATE_FIELD:
                return this.FieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE:
                return this.SafeFieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_START:
                return this.StartFieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE_ENEMY:
                return this.SafeEnemyFieldValidation(field,incomingPiece);
            default:
                return true;
        }
    },
    FieldValidation: function(field,incomingPiece){
        const pieces = field.querySelectorAll('[name="' + Constants.PIECE + '"]');
        return true;
    },
    SafeFieldValidation: function(field,incomingPiece){
        console.log("safe_field");
        return true;
    },
    StartFieldValidation: function(field,incomingPiece){
        console.log("START");
        return true;
    },
    SafeEnemyFieldValidation: function(field,incomingPiece){
        console.log("safe_enemy");
        return true;
    },
    MaxPieceCountInFieldValidation: function(field){
        if(field.querySelectorAll('.piece').length < 2) return true;

        return false;
    },
    EntranceToSpecialZoneValidation: function(requestedNum,currentNum,color){
        while(true){
            currentNum++;
            currentNum = currentNum > 68 ? currentNum - 68  : currentNum;
            let field = document.querySelector('#' + Constants.PIECE_STATE_FIELD + currentNum);
            if(currentNum == GetEntranceSpecialZoneByColor(color)) return true;
            if(currentNum == requestedNum) return false;
        }
    },
    MaxNumPiecesInFieldValidation: function(field){
        return field.querySelectorAll('.' + Constants.PIECE).length > 1;
    }
}

function GetEntranceSpecialZoneByColor(color){
    switch (color) {
        case "red":
            return 68;
        case "yellow":
            return 34;
        case "blue":
            return 17;
        case "green":
            return 51;
    }
}

function GetStartField(color) {
    
}
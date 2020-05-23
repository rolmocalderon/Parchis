const Constants = require('./Constants');

module.exports = {
    GetAccesibleFields: function(incomingPiece,dieces) {
        const state = incomingPiece.parentElement.getAttribute('state');
        const color = incomingPiece.getAttribute('color');
        const home = document.getElementById(color);
        
        if(state === Constants.PIECE_STATE_HOME){
            let canLeaveHome = Object.values(dieces).some(x => x == Constants.DIECES_START_VALUE);
            if(canLeaveHome && home.querySelector('[state="' + Constants.PIECE_STATE_SAFE_SELF +'"]').querySelectorAll('.' + Constants.PIECE).length < 2){
                return home.querySelectorAll('[state="' + Constants.PIECE_STATE_SAFE_SELF +'"]');
            }
        }else{
            let field = incomingPiece.parentElement;
            let currentFieldNum = parseInt(field.id.split(Constants.PIECE_STATE_FIELD)[1]);
            let diecesSum = Object.values(dieces).reduce((accumulator, currentValue) => accumulator + currentValue);
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

        const state = field.getAttribute('state');
        switch (state) {
            case Constants.PIECE_STATE_FIELD:
                return this.FieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE:
                return this.SafeFieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE_SELF:
                return this.SafeSelfFieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE_ENEMY:
                return this.SafeEnemyFieldValidation(field,incomingPiece);
            default:
                return false;
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
    SafeSelfFieldValidation: function(field,incomingPiece){
        console.log("SAFE SELF");
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
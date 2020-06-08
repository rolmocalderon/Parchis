const Constants = require('./Constants');

module.exports = {
    GetAccesibleFields: function(incomingPiece,game) {
        const state = incomingPiece.parentElement.getAttribute('name');
        const color = incomingPiece.getAttribute('color');
        let targetField;
        
        if(state === Constants.PIECE_STATE_HOME){
            let canLeaveHome = Object.values(game.dieces).some(x => x == Constants.DIECES_START_VALUE);
            let field = game.fields.find(field => field.state == Constants.PIECE_STATE_START && field.color == color);
            let fieldElement = document.querySelectorAll('#' + field.id);
            if(canLeaveHome && !this.MaxNumPiecesInFieldValidation(fieldElement[0])){
                targetField = fieldElement;
            }
        }else if(state === Constants.PIECE_STATE_SPECIAL_FIELD){
            console.log(game);
        }else{
            let field = incomingPiece.parentElement;
            let currentFieldNum = parseInt(field.id.split(Constants.PIECE_STATE_FIELD)[1]);
            let diecesSum = Object.values(game.dieces).reduce((accumulator, currentValue) => accumulator + currentValue);
            let requestedFieldNum = diecesSum + currentFieldNum;
            requestedFieldNum = requestedFieldNum > 68 ? requestedFieldNum - 68  : requestedFieldNum;

            let specialZoneValues = this.EntranceToSpecialZoneValidation(requestedFieldNum,currentFieldNum,color);
            requestedFieldNum = specialZoneValues.currentNum;

            targetField = document.querySelectorAll('#' + Constants.PIECE_STATE_FIELD + requestedFieldNum);
        }
        
        return targetField;
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
            if(currentNum == GetEntranceSpecialZoneByColor(color)) {
                let stepsLeft = currentNum > 68 ? requestedNum - (currentNum - 68)  : requestedNum - currentNum;
                let field = document.querySelector(`#${ color }${ Constants.PIECE_STATE_SPECIAL_FIELD }${ stepsLeft }`);
                return {currentNum,stepsLeft};
            }
            if(currentNum == requestedNum) return {'currentNum':requestedNum};
        }
    },
    MaxNumPiecesInFieldValidation: function(field){
        return field.querySelectorAll('.' + Constants.PIECE).length > 1;
    }
}

function GetEntranceSpecialZoneByColor(color){
    switch (color) {
        case "Red":
            return 34;
        case "Yellow":
            return 68;
        case "Blue":
            return 17;
        case "Green":
            return 51;
    }
}
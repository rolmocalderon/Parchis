const Constants = require('./Constants');

module.exports = {
    getAccesibleField: function(actualField,game,color) {
        const state = actualField.getAttribute('name');
        let targetField;
        let currentFieldNum = parseInt(actualField.id.split(Constants.PIECE_STATE_FIELD)[1]);
        let requestedFieldNum = game.dieces.diecesSum + currentFieldNum;
        requestedFieldNum = requestedFieldNum > 68 ? requestedFieldNum - 68  : requestedFieldNum;

        if(state === Constants.PIECE_STATE_HOME){
            targetField = this.getHomeField(game.dieces,game.fields,color);
        }else if(state === Constants.PIECE_STATE_SPECIAL_FIELD){
            let actualFieldId = parseInt(field.id.split(color + Constants.PIECE_STATE_SPECIAL_FIELD)[1]);
            targetField = this.getSpecialField(actualFieldId,game.dieces.diecesSum,color);
        }else if(this.isEntranceToSpecialZone(requestedFieldNum,currentFieldNum,color)){
            let entranceFieldNum = GetEntranceSpecialZoneByColor(color);
            let stepsLeft = dieces.diecesSum - (entranceFieldNum - currentFieldNum);
            targetField = this.getSpecialField(entranceFieldNum,stepsLeft,color);
        }else if(this.isWallInRoute(game,currentFieldNum,requestedFieldNum)){
            let wallRouteFieldId = game.wallInRouteField.id.split(Constants.PIECE_STATE_FIELD)[1] - 1;
            let requestedFieldNum = wallRouteFieldId - (game.dieces.diecesSum - (wallRouteFieldId - currentFieldNum));
            targetField = this.getField(requestedFieldNum);
        }else{
            targetField = this.getField(requestedFieldNum,game.dieces,currentFieldNum,color);
        }
        
        return targetField;
    },
    getHomeField: function(dieces,fields,color) {
        let canLeaveHome = Object.values(dieces).some(x => x == Constants.DIECES_START_VALUE);
        let field = fields.find(field => field.state == Constants.PIECE_STATE_START && field.color == color);
        let fieldElement = document.querySelector('#' + field.id);
        if(canLeaveHome && !this.MaxNumPiecesInFieldValidation(fieldElement)){
            return fieldElement;
        }
    },
    getField: function(requestedFieldNum) {
        return document.querySelector('#' + Constants.PIECE_STATE_FIELD + requestedFieldNum);
    },
    getSpecialField: function(currentNum,steps,color) {
        currentNum = Object.values(Constants.BOARD_SPECIALZONE_ENTRANCEFIELD_LIST).includes(currentNum) ? 8 : currentNum;
        let num = currentNum - steps;
        if(num < 0){
            currentNum = (num * -1);
        }else{
            currentNum = num;
        }

        return document.querySelector(`#${ color }${ Constants.PIECE_STATE_SPECIAL_FIELD }${ currentNum }`);
    },
    isWallInRoute: function(game,currentFieldNum,requestedFieldNum){
        for(let i = ++currentFieldNum; i < requestedFieldNum; i++){
            let field = document.querySelector('#' + Constants.PIECE_STATE_FIELD + i);
            if(this.isMaxPieceCountInField(field)){
                game.wallInRouteField = field;
                return true;
            }
        }
        return false;
    },
    validateMovement: function(targetField,incomingPiece,isEatenPiece) {
        if(!isEatenPiece){
            if(this.isMaxPieceCountInField(targetField)) return false;
        }

        const state = targetField.getAttribute('name');
        switch (state) {
            case Constants.PIECE_STATE_FIELD:
                return this.fieldValidation(targetField,incomingPiece);
            case Constants.PIECE_STATE_SAFE:
                return this.safeFieldValidation(targetField,incomingPiece);
            case Constants.PIECE_STATE_START:
                return this.startFieldValidation(targetField,incomingPiece);
            case Constants.PIECE_STATE_SAFE_ENEMY:
                return this.safeEnemyFieldValidation(targetField,incomingPiece);
            default:
                return true;
        }
    },
    fieldValidation: function(targetField,incomingPiece,state){
        return true;
    },
    safeFieldValidation: function(field,incomingPiece){
        console.log("safe_field");
        return true;
    },
    startFieldValidation: function(field,incomingPiece){
        console.log("START");
        return true;
    },
    safeEnemyFieldValidation: function(field,incomingPiece){
        console.log("safe_enemy");
        return true;
    },
    isMaxPieceCountInField: function(field){
        return field.querySelectorAll('.piece').length === 2;
    },
    isEntranceToSpecialZone: function(requestedNum,currentNum,color){
        while(true){
            currentNum++;
            if(currentNum == GetEntranceSpecialZoneByColor(color)) {
                console.log("Is Entrance To Special Zone");
                return true;
            }
            
            currentNum = currentNum > 68 ? currentNum - 68  : currentNum;
            if(currentNum == requestedNum) return false;
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
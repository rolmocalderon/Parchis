const Constants = require('./Constants');

module.exports = {
    GetAccesibleFields: function(incomingPiece,dieces) {
        const state = incomingPiece.parentElement.getAttribute('state');
        const color = incomingPiece.getAttribute('color');

        if(state === Constants.PIECE_STATE_HOME){
            const home = document.getElementById(color);
            let canLeaveHome = Object.values(dieces).some(x => x == Constants.DIECES_START_VALUE);
            if(canLeaveHome){
                return home.querySelectorAll('[state="' + Constants.PIECE_STATE_SAFE_SELF +'"]');
            }
        }
    },
    ValidateMovement: function(field,incomingPiece) {
        const state = field.getAttribute('state');
        switch (state) {
            case Constants.PIECE_STATE_FIELD:
                return FieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE:
                return SafeFieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE_SELF:
                return SafeSelfFieldValidation(field,incomingPiece);
            case Constants.PIECE_STATE_SAFE_ENEMY:
                return SafeEnemyFieldValidation(field,incomingPiece);
            default:
                return false;
        }
    },
    FieldValidation: function(field,incomingPiece){
        const pieces = field.querySelectorAll('[name="' + Constants.PIECE + '"]');
        return false;
    },
    SafeFieldValidation: function(field,incomingPiece){
        console.log(safe_field);
    },
    SafeSelfFieldValidation: function(field,incomingPiece){
        console.log(safe_self);
    },
    SafeEnemyFieldValidation: function(field,incomingPiece){
        console.log(safe_enemy);
    }
}
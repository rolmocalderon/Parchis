const Constants = require('../lib/Constants');

module.exports = {
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
module.exports = {
    //BOARD
    BOARD_BOX_NUMBER: '17',
    BOARD_SPECIALZONEBOX_NUMBER: '8',
    BOARD_STARTHOMEFIELD_NUMBER_LIST: [5,22,39,56],
    BOARD_SAFEFIELD_NUMBER_LIST: [12,17,29,34,46,51,63,68],

    //SOCKET
    SOCKET_UPDATE: 'update',
    SOCKET_NEW_PLAYER: 'new_player',
    SOCKET_PLAYER_ACTION: 'player_action',
    SOCKET_DISCONNECT: 'disconnect',
    SOCKET_REFRESH: 'refresh',

    //PIECES
    PIECE_STATE_HOME: 'home',
    PIECE_STATE_END: 'end',
    PIECE_STATE_FIELD: 'field',
    PIECE_STATE_SAFE: 'safe',
    PIECE_STATE_SAFE_SELF: 'safe_self',
    PIECE_STATE_SAFE_ENEMY: 'safe_enemy',
    PIECE_STATE_SPECIAL_ZONE: 'special_zone'
};
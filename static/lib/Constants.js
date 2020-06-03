module.exports = {
    //GAME CONFIG
    GAME_CONFIG_FRAME_RATE: 2000,

    //GAME STATUS
    GAME_STATUS_PAUSE: 'pause',
    GAME_STATUS_PLAYING: 'playing',
    GAME_STATUS_NOT_STARTED: 'notStarted',
    
    //BOARD
    BOARD_BOX_NUMBER: '17',
    BOARD_SPECIALZONEBOX_NUMBER: '8',
    BOARD_STARTHOMEFIELD_NUMBER_LIST: [5,22,39,56],
    BOARD_SAFEFIELD_NUMBER_LIST: [12,17,29,34,46,51,63,68],
    BOARD_SPECIALZONE_ENTRANCEFIELD_LIST: {
        'red': 68,
        'blue':17,
        'yellow':34,
        'green':51
    },

    //DIECES
    DIECES_START_VALUE: 5,

    //SOCKET
    SOCKET_UPDATE: 'update',
    SOCKET_NEW_PLAYER: 'newPlayer',
    SOCKET_ACTION_MOVE_PIECE: 'movePiece',
    SOCKET_ACTION_PIECE_MOVED: 'pieceMoved',
    SOCKET_ACTION_THROW_DIECES: 'throwDieces',
    SOCKET_DISCONNECT: 'disconnect',
    SOCKET_REFRESH: 'refresh',
    SOCKET_START_GAME: 'start',

    //PIECES
    PIECE: 'piece',
    PIECE_STATE_HOME: 'home',
    PIECE_STATE_START: 'start',
    PIECE_STATE_END: 'endField',
    PIECE_STATE_FIELD: 'field',
    PIECE_STATE_SAFE: 'safeField',
    PIECE_STATE_SAFE_SELF: 'safeSelf',
    PIECE_STATE_SAFE_ENEMY: 'safeEnemy',
    PIECE_STATE_SPECIAL_FIELD_ENTRANCE: 'specialFieldEntrace',
    PIECE_STATE_SPECIAL_FIELD: 'specialField'
};
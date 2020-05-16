const $ = require('jquery');
const io = require('socket.io-client');
const Game = require('./Game.js');
const Constants = require('../lib/Constants');

$(document).ready(function(){
    try{
        const socket = io('http://localhost:5000');
        const board = document.getElementById('board');
        const game = Game.Create(socket, board);
    
        let playersCount = 0;
        do {
            const player = GetPlayer();
            const name = player.name;
            const color = player.color; 
    
            socket.emit(Constants.SOCKET_NEW_PLAYER, { name, color } /* Callback function to print the pieces into the board */);
            playersCount += 1;
        } while (!playersCount > 0);

        document.addEventListener(Constants.SOCKET_REFRESH, function(data){
            console.log("YEAP");
        });
    }catch(ex){
        console.error(ex);
    }
});

function GetPlayer(){
    const players = [
        {'name':'Ruben','color':'red'},
        {'name':'Alba','color':'blue'},
        {'name':'Lara','color':'green'},
        {'name':'Ana','color':'yellow'}
    ];

    return players[Math.floor(Math.random() * players.length)];
}
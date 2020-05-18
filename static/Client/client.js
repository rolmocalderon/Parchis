const $ = require('jquery');
const io = require('socket.io-client');
const Game = require('./Game.js');
const Constants = require('../lib/Constants');

var colors = null;

$(document).ready(function(){
    try{
        const socket = io();
        const board = document.getElementById('board');
        CreateBoard(board);
        const game = Game.Create(socket);
        
        $.get('/colors', HandleColorsResponse);
    
        AddNewPlayer(socket);

        document.addEventListener(Constants.SOCKET_REFRESH, function(response){
            let data = response.detail;
            if(data && board){
                const players = response.detail.players;
                const self = response.detail.self;
                for(const player of players){
                    PopulatePlayerRegion(player[1]);
                }
            }
        });

        window.addEventListener("beforeunload", function (e) {
            socket.emit(Constants.SOCKET_DISCONNECT);
            return "Message";
        });
    }catch(ex){
        console.error(ex);
    }
});

function AddNewPlayer(socket){
    const player = GetPlayer();
    const name = player.name;
    const color = player.color;

    socket.emit(Constants.SOCKET_NEW_PLAYER, { name, color } /* Callback function to print the pieces into the board */);
}

function GetPlayer() {
    const players = [
        {'name':'Ruben','color':'red'},
        {'name':'Alba','color':'blue'},
        {'name':'Lara','color':'green'},
        {'name':'Ana','color':'yellow'}
    ];

    return players[Math.floor(Math.random() * players.length)];
}

function HandleColorsResponse(response) {
    colors = response;
}

function PopulatePlayerRegion(player){
    const region = document.getElementById(player.color.color);
    const owner = region.getAttribute('owner');
    if(owner !== player.name){
        region.setAttribute('owner',player.name);
        region.insertAdjacentHTML("beforeend", `<h3>${ player.name }</h3>`);
    }
}

function CreateBoard(board) {
    let num = 1;
    for(let i=0; i < board.children.length; i++){
        let region = board.children[i];
        const color = region.id;
        for(let i=1; i <= Constants.BOARD_BOX_NUMBER; i++) {
            let parent = region
            let state;
       
            if(i == Constants.BOARD_BOX_NUMBER){
                parent.insertAdjacentHTML("beforeend", `<div class="special-zone"></div>`)
                parent = parent.lastChild;
                state = Constants.PIECE_STATE_SAFE;
            }
            
            InsertField(parent,num,color);

            num++;
        }

        CreateSpecialZone(region.lastChild, color);
    }
}

function InsertField(region,num,color) {
    let className = Constants.PIECE_STATE_FIELD;
    let state = Constants.PIECE_STATE_FIELD;
    let text = '';
    let isDotType = false;

    let field = CreateElement(region,"beforeend",`<div class state></div>`);

    if(IsFieldType(num,Constants.BOARD_STARTHOMEFIELD_NUMBER_LIST)){
        CreateHome(field, color);
        className += ' ' + color + ' ' + Constants.PIECE_STATE_HOME;
        state = Constants.PIECE_STATE_HOME;
        isDotType = true;
    }else if(IsFieldType(num,Constants.BOARD_SAFEFIELD_NUMBER_LIST)){
        className += ' ' + Constants.PIECE_STATE_SAFE;
        state = Constants.PIECE_STATE_SAFE;
        isDotType = true;
    }else{
        text = num;
    }

    if(isDotType) CreateElement(field,"beforeend",GetDotTemplate(color,num));
    else field.innerText = text;

    field.className = className;
    field.setAttribute('state',state);
}

function CreateElement(parent,position,template){
    parent.insertAdjacentHTML(position,template);
    return parent.lastChild;
}

function GetDotTemplate(color,text){
    return `<span class="dot" color="${ color }">${ text }</span>`
}

function IsFieldType(num,fieldsList){
    return fieldsList.includes(num) ? true : false;
}

function CreateSpecialZone(specialZoneParent, color) {
    for(let i=1; i <= Constants.BOARD_SPECIALZONEBOX_NUMBER; i++) {
        let className = 'field special ' + color;
        let state = Constants.PIECE_STATE_SPECIAL_ZONE;

        if(i == Constants.BOARD_SPECIALZONEBOX_NUMBER){
            state = Constants.PIECE_STATE_END;
        }
        
        specialZoneParent.insertAdjacentHTML("beforeend", `<div class="${ className }" state="${ state }"></div>`);
    }
}

function CreateHome(region, color) {
    region.insertAdjacentHTML("beforebegin", `<div class="home ${ color }" state="${ Constants.PIECE_STATE_HOME }">HOME OF THE ${ color }</div>`);
}
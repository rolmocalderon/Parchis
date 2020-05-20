const $ = require('jquery');
const io = require('socket.io-client');
const Game = require('./Game.js');
const Constants = require('../lib/Constants');
const MoveValidations = require('../lib/MoveValidations');

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

            console.log("Lets validate");
            MoveValidations.FieldValidation(document.getElementById("field44"));
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

    socket.emit(Constants.SOCKET_NEW_PLAYER, { player }, PopulatePlayerRegion);
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
    const region = document.getElementById(player.color);
    const owner = region.getAttribute('owner');
    if(owner !== player.name){
        region.setAttribute('owner',player.name);
        region.insertAdjacentHTML("beforeend", `<h3>${ player.name }</h3>`);
    }

    const home = region.querySelector('[state="home"]');
    for(let piece of player.pieces){
        if(home.querySelectorAll('.piece').length < 4){
            CreateElement(home,'afterbegin',`<span class="dot piece ${ player.color }" color="${ player.color }" style=""></span>`);
        }
    }
}

function CreateBoard(board) {
    let num = 1;
    for(let i=0; i < board.children.length; i++){
        let region = board.children[i];
        const color = region.id;

        for(let j=1; j <= Constants.BOARD_BOX_NUMBER; j++) {
            if(j == Constants.BOARD_BOX_NUMBER){
                CreateElement(region,'beforeend',GetSpecialZoneTemplate());
                region = region.lastChild;
            }

            InsertField(region,num,color);
            num++;
        }
    }

    for(let item of board.children){
        const fieldId = 'field' + Constants.BOARD_SPECIALZONE_ENTRANCEFIELD_LIST[item.id];
        const specialZone = document.getElementById(fieldId).parentNode;
        CreateSpecialZone(specialZone, item.id);
    }
}

function InsertField(region,num,color) {
    let className = Constants.PIECE_STATE_FIELD;
    let state = Constants.PIECE_STATE_FIELD;
    let text = '';
    let isDotType = false;

    let field = CreateElement(region,"beforeend",GetFieldTemplate());

    if(IsFieldType(num,Constants.BOARD_STARTHOMEFIELD_NUMBER_LIST)){
        CreateHome(field, color);
        className += ' ' + color + ' ' + Constants.PIECE_STATE_SAFE_SELF;
        state = Constants.PIECE_STATE_SAFE_SELF;
        isDotType = true;
    }else if(IsFieldType(num,Constants.BOARD_SAFEFIELD_NUMBER_LIST)){
        className += ' ' + Constants.PIECE_STATE_SAFE;
        state = Constants.PIECE_STATE_SAFE;
        isDotType = true;
    }else{
        text = num;
    }

    let fieldClassList = 'field-number';
    if(isDotType) fieldClassList += ' dot';

    let params = {
        'classList': fieldClassList,
        'color': color,
        'text': num
    }
    CreateElement(field,"beforeend",GetDotTemplate(params));

    field.className = className;
    field.setAttribute('state',state);
    field.setAttribute('id','field'+ num);

    /*<div class="field" state="field">
        <span class="dot piece red" color="red"></span>
        <span class="field-number">10</span>
        <span class="dot piece red" color="red"></span>
    </div>*/
}

function CreateElement(parent,position,template){
    if(!template) return null;
    parent.insertAdjacentHTML(position,template);
    return parent.lastChild;
}

function GetDotTemplate(params){
    return `<span id="${ params.id ?? '' }" class="${ params.classList }" color="${ params.color }">${ params.text }</span>`;
}

function GetSpecialZoneTemplate(params){
    return `<div class="special-zone"></div>`;
}

function GetSpecialZoneFieldTemplate(params){
    if(!params) return null;
    return `<div id="${ params.id ?? '' }" class="${ params.className }" state="${ params.state }"></div>`;
}

function GetFieldTemplate(){
    return `<div class state></div>`
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
        
        const id = 'specialZone' + i;
        let params = { id,className,state };
        CreateElement(specialZoneParent,'beforeend',GetSpecialZoneFieldTemplate(params));
    }
}

function CreateHome(region, color) {
    region.insertAdjacentHTML("beforebegin", `<div class="home ${ color }" state="${ Constants.PIECE_STATE_HOME }"></div>`);
}
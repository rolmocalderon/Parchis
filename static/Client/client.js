const $ = require('jquery');
const io = require('socket.io-client');
const Game = require('./Game.js');
const Constants = require('../lib/Constants');
const PieceMovement = require('../lib/PieceMovement');

var colors = null;
var game = null;
var dieces = {
    'dieceOne': 5,
    'dieceTwo': 3
}

$(document).ready(function () {
    try {
        const socket = io();
        const board = document.getElementById('board');
        game = Game.Create(socket);

        CreateBoard(board);
        setField("field1",false);

        $.get('/colors', HandleColorsResponse);

        AddNewPlayer(socket);

        document.addEventListener(Constants.SOCKET_START_GAME, function (response) {
            let data = response.detail;
            if (data && board) {
                const players = response.detail.players;
                for (const player of players) {
                    PopulatePlayerRegion(player[1]);
                }
            }

            console.log("Lets validate");
            PieceMovement.FieldValidation(document.getElementById("field44"));
        });

        let throwDiecesButton = document.getElementById('throwDieces');
        throwDiecesButton.addEventListener('click',ThrowDieces);

        window.addEventListener("beforeunload", function (e) {
            socket.emit(Constants.SOCKET_DISCONNECT);
            return "Message";
        });
    } catch (ex) {
        console.error(ex);
    }
});

function ThrowDieces(){
    let dieceOneSpan = document.querySelector('#diece-one > [name="value"]');
    let dieceTwoSpan = document.querySelector('#diece-two > [name="value"]');
    let dieceOne = Math.floor(Math.random() * Math.floor(6)) + 1;
    let dieceTwo = Math.floor(Math.random() * Math.floor(6)) + 1;

    dieces.dieceOne = dieceOne, dieceOneSpan.innerHTML = dieceOne;
    dieces.dieceTwo = dieceTwo, dieceTwoSpan.innerHTML = dieceTwo;

    DeselectAllPieces();
    UnSetAccesibleFields();
    game.canMove = true;
    game.selectedPiece = null;
}

function AddNewPlayer(socket) {
    const player = GetPlayer();

    socket.emit(Constants.SOCKET_NEW_PLAYER, { player }, undefined);
}

function GetPlayer() {
    const players = [
        { 'name': 'Ruben', 'color': 'red' },
        { 'name': 'Alba', 'color': 'blue' },
        { 'name': 'Lara', 'color': 'green' },
        { 'name': 'Ana', 'color': 'yellow' }
    ];

    return players[Math.floor(Math.random() * players.length)];
}

function MovePiece() {
    let selectedPiece = document.querySelector('.selected');

    if(!PieceMovement.ValidateMovement(this,selectedPiece)) return;
    //Object.values(game.self.pieces).some(x => x.id == selectedPiece.id);
    this.appendChild(selectedPiece);
    this.classList.remove('accesible-field');
    this.removeEventListener('click',MovePiece);

    selectedPiece.classList.remove('selected');
    selectedPiece.addEventListener('click', SelectPiece);

    document.dispatchEvent(new CustomEvent(Constants.SOCKET_PLAYER_ACTION, {
        detail: { 'self': game.self }
    }));

    game.canMove = false;
}

function HandleColorsResponse(response) {
    colors = response;
}

function PopulatePlayerRegion(player) {
    const region = document.getElementById(player.color);
    const owner = region.getAttribute('owner');
    const home = region.querySelector('[state="home"]');

    if (owner !== player.name) {
        region.setAttribute('owner', player.name);
        CreateElement(home,'beforebegin',`<h3>${player.name}</h3>`);
    }

    for (let piece of player.pieces) {
        const element = CreateElement(home, 'beforeend', `<span id="${player.color + piece.id}" class="dot piece ${player.color}" color="${player.color}" style=""></span>`);
        element.addEventListener('click', SelectPiece);
    }
}

function DeselectAllPieces() {
    const allPieces = document.querySelectorAll('.' + Constants.PIECE);
    for (let p of allPieces) {
        p.classList.remove('selected');
    }
}

function SelectPiece() {
    if(this.getAttribute('color') !== game.self.color || !game.canMove) return;
    DeselectAllPieces();
    let accesibleFields = PieceMovement.GetAccesibleFields(this, dieces)
    if(accesibleFields){
        EmphasizeAccesibleFields(accesibleFields);
    }

    this.classList.add('selected');
    game.selectedPiece = this;
}

function UnSetAccesibleFields(){
    let accesibleFields = document.querySelectorAll('.accesible-field');
    if(accesibleFields.length > 0){
        Array.prototype.map.call(accesibleFields, x => x.classList.remove('accesible-field'));
    }
}

function EmphasizeAccesibleFields(accesibleFields) {
    UnSetAccesibleFields();
    for (let field of accesibleFields) {
        field.classList.add('accesible-field');
        field.addEventListener('click', MovePiece);
    }
}

function CreateBoard(board) {
    let num = 1;
    for (let i = 0; i < board.children.length; i++) {
        let region = board.children[i];
        const color = region.id;

        for (let j = 1; j <= Constants.BOARD_BOX_NUMBER; j++) {
            if (j == Constants.BOARD_BOX_NUMBER) {
                CreateElement(region, 'beforeend', GetSpecialZoneTemplate());
                region = region.lastChild;
            }

            InsertField(region, num, color);
            num++;
        }
    }

    for (let item of board.children) {
        const fieldId = 'field' + Constants.BOARD_SPECIALZONE_ENTRANCEFIELD_LIST[item.id];
        const specialZone = document.getElementById(fieldId).parentNode;
        CreateSpecialZone(specialZone, item.id);
    }
}

function InsertField(region, num, color) {
    let className = Constants.PIECE_STATE_FIELD;
    let state = Constants.PIECE_STATE_FIELD;
    let isDotType = false;
    let isHomeField = IsFieldType(num, Constants.BOARD_STARTHOMEFIELD_NUMBER_LIST);
    let isSafeField = IsFieldType(num, Constants.BOARD_SAFEFIELD_NUMBER_LIST);

    let field = CreateElement(region, "beforeend", GetFieldTemplate());

    if (isHomeField) {
        CreateHome(field, color);
        className += ' ' + color + ' ' + Constants.PIECE_STATE_SAFE_SELF;
        state = Constants.PIECE_STATE_SAFE_SELF;
        isDotType = true;
    } else if (isSafeField) {
        className += ' ' + Constants.PIECE_STATE_SAFE;
        state = Constants.PIECE_STATE_SAFE;
        isDotType = true;
    }

    let fieldClassList = 'field-number';
    if (isDotType) fieldClassList += ' dot';

    let params = {
        'classList': fieldClassList,
        'color': color,
        'text': num
    }
    CreateElement(field, "beforeend", GetDotTemplate(params));

    let id = Constants.PIECE_STATE_FIELD + num;
    field.className = className;
    field.setAttribute('state', state);
    field.setAttribute('id', id);

    if(isHomeField) {
        setField(id,false,state,color);
        return;
    }

    setField(id,false,state);
}

function setField(id,isOccuppied,state,color) {
    let oldField = Object.values(game.fields).find(x => x.id == id);
    if (oldField) {
        oldField.isOccuppied = isOccuppied;
    }else{
        let fieldInfo = { id, isOccuppied, state };
        if(color){
            Object.defineProperty(fieldInfo, 'color', {
                value: color,
            });
        }
        
        game.fields.push(fieldInfo);
    }
}

function CreateElement(parent, position, template) {
    if (!template) return null;
    parent.insertAdjacentHTML(position, template);
    return parent.lastChild;
}

function GetDotTemplate(params) {
    return `<span id="${params.id ?? ''}" class="${params.classList}" color="${params.color}">${params.text}</span>`;
}

function GetSpecialZoneTemplate(params) {
    return `<div class="special-zone"></div>`;
}

function GetSpecialZoneFieldTemplate(params) {
    if (!params) return null;
    return `<div id="${params.id ?? ''}" class="${params.className}" state="${params.state}"></div>`;
}

function GetFieldTemplate() {
    return `<div class state></div>`
}

function IsFieldType(num, fieldsList) {
    return fieldsList.includes(num) ? true : false;
}

function CreateSpecialZone(specialZoneParent, color) {
    for (let i = 1; i <= Constants.BOARD_SPECIALZONEBOX_NUMBER; i++) {
        let className = 'field special ' + color;
        let state = Constants.PIECE_STATE_SPECIAL_ZONE;

        if (i == Constants.BOARD_SPECIALZONEBOX_NUMBER) {
            state = Constants.PIECE_STATE_END;
        }

        const id = 'specialZone' + i;
        let params = { id, className, state };
        CreateElement(specialZoneParent, 'beforeend', GetSpecialZoneFieldTemplate(params));
    }
}

function CreateHome(region, color) {
    region.insertAdjacentHTML("beforebegin", `<div class="home ${color}" state="${Constants.PIECE_STATE_HOME}"></div>`);
    let id = color + Constants.PIECE_STATE_HOME;
    setField(id,true,Constants.PIECE_STATE_HOME,color);
}
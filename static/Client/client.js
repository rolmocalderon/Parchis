const $ = require('jquery');
const io = require('socket.io-client');
const Game = require('./Game.js');
const Constants = require('../lib/Constants');
const PieceMovement = require('../lib/PieceMovement');

var colors;
var game = null;

$(document).ready(function () {
    try {
        const socket = io();
        const board = document.getElementById('board');
        game = Game.Create(socket);
        InitFifelds();

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
        });

        let throwDiecesButton = document.getElementById('throwDieces');
        throwDiecesButton.addEventListener('click',ThrowDieces);

        window.addEventListener("beforeunload", function () {
            socket.emit(Constants.SOCKET_DISCONNECT);
            return "Message";
        });
    } catch (ex) {
        console.error(ex);
    }
});

function InitFifelds() {
    let fields = document.querySelectorAll('.field:not(.spec)');
    let specialFields = document.querySelectorAll('.field.spec');

    let isOccuppied = false;
    let state;

    for(let field of fields){
        let id = Constants.PIECE_STATE_FIELD + field.innerText;
        state = field.getAttribute('name') ?? Constants.PIECE_STATE_FIELD;
        let color = field.getAttribute('name') == Constants.PIECE_STATE_START ? field.getAttribute('color') : null;

        setField(field,id,isOccuppied,state,color);
    }

    //TODO This shit
    specialFields.forEach(function(specialField,index){
        let id = Constants.PIECE_STATE_SPECIAL_FIELD + index;
        state = Constants.PIECE_STATE_SPECIAL_FIELD;
        setField(specialField,id,isOccuppied,state,null);
    });
}

function ThrowDieces(){
    document.dispatchEvent(new CustomEvent(Constants.SOCKET_ACTION_THROW_DIECES, { detail: { 'callback': handleDiecesResponse } }));
}

function handleDiecesResponse(dieces){
    game.dieces = dieces;
    let dieceOneSpan = document.querySelector('#diece-one > [name="value"]');
    let dieceTwoSpan = document.querySelector('#diece-two > [name="value"]');

    dieceOneSpan.innerHTML = game.dieces.dieceOne;
    dieceTwoSpan.innerHTML = game.dieces.dieceTwo;

    DeselectAllPieces();
    UnSetAccesibleFields();
    game.canMove = true;
    game.selectedPiece = null;
}

function AddNewPlayer(socket) {
    const player = GetPlayer();

    socket.emit(Constants.SOCKET_NEW_PLAYER, { player }, PopulatePlayerRegion);
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
    let selectedPiece = game.selectedPiece;

    if(!PieceMovement.ValidateMovement(this,selectedPiece)) return;
    //Object.values(game.self.pieces).some(x => x.id == selectedPiece.id);
    if(this.querySelectorAll('.piece').length > 0){
        this.prepend(selectedPiece);
    }else{
        this.append(selectedPiece);
    }
    
    this.classList.remove('accesible-field');
    this.removeEventListener('click',MovePiece);

    selectedPiece.classList.remove('selected');
    selectedPiece.addEventListener('click', SelectPiece);

    document.dispatchEvent(new CustomEvent(Constants.SOCKET_ACTION_MOVE_PIECE, {
        detail: { 'self': game.self }
    }));

    game.canMove = false;
}

function HandleColorsResponse(response) {
    colors = response;
}

function PopulatePlayerRegion(player) {
    const region = document.getElementById(player.color);
    const home = region.querySelector('[name="home"]');

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
    let accesibleFields = PieceMovement.GetAccesibleFields(this, game)
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

function setField(field,id,isOccuppied,state,color) {
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
        
        field.id = id;
        game.fields.push(fieldInfo);
    }
}

function CreateElement(parent, position, template) {
    if (!template) return null;
    parent.insertAdjacentHTML(position, template);
    return parent.lastChild;
}
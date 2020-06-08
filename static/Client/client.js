const $ = require('jquery');
const io = require('socket.io-client');
const Game = require('./Game.js');
const Constants = require('../lib/Constants');
const PieceMovement = require('../lib/PieceMovement');

var game = null;

$(document).ready(function () {
    try {
        const socket = io();
        const board = document.getElementById('board');
        game = Game.Create(socket);
        
        InitColors();
        InitNameForm(socket);

        InitFields();

        document.addEventListener(Constants.SOCKET_START_GAME, function (response) {
            let data = response.detail;
            if (data && board) {
                const players = response.detail.players;
                for (const player of players) {
                    if(player[1].socketID !== data.self.socketID){
                        PopulatePlayerRegion(player[1]);
                    }
                }
            }
        });

        document.addEventListener(Constants.SOCKET_ACTION_PIECE_MOVED, function(data){
            //MovePiece();
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

function InitNameForm(socket) {
    let nameForm = document.getElementById('name-form');
    nameForm.addEventListener('submit',function(event){
        event.preventDefault();
        let inputName = this.querySelector('#name-input');
        let colorsDropDown = this.querySelector('#colorsDropDown');
        let selectedColor = colorsDropDown.options[colorsDropDown.selectedIndex].value;
        let selectedName = inputName.value;
        if(!selectedColor || !selectedName){
            alert("Debes escoger un nombre y un color");
            return;
        }

        AddNewPlayer(socket,selectedName,selectedColor);
    });
}

function InitFields() {
    let fields = document.querySelectorAll('.field:not(.spec)');
    let specialFieldsContainer = document.querySelectorAll('[name="specialFieldsContainer"]');
    let endFields = document.querySelectorAll('[name="endField"]');

    let isOccuppied = false;
    let state;

    for(let field of fields){
        let id = Constants.PIECE_STATE_FIELD + field.innerText.trim();
        state = field.getAttribute('name') ?? Constants.PIECE_STATE_FIELD;
        let color = field.getAttribute('name') == Constants.PIECE_STATE_START ? field.getAttribute('color') : null;

        setField(field,id,isOccuppied,state,color);
    }

    specialFieldsContainer.forEach(function(specialFields){
        specialFields = specialFields.querySelectorAll('.spec');
        let index = 1;
        specialFields.forEach(function(specialField){
            let color = specialField.closest('.region').id;
            let id = color + Constants.PIECE_STATE_SPECIAL_FIELD + index;
            state = Constants.PIECE_STATE_SPECIAL_FIELD;
            setField(specialField,id,isOccuppied,state,color);
            index++;
        });
    });

    for(let endField of endFields){
        let color = endField.closest('.region').id;
        let id = color + Constants.PIECE_STATE_SPECIAL_FIELD + '0';
        let state = Constants.PIECE_STATE_END;
        setField(endField,id,isOccuppied,state,color);
    }
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

function AddNewPlayer(socket,name,color) {
    let player = {
        name, color
    }
    //const player = GetPlayer();

    socket.emit(Constants.SOCKET_NEW_PLAYER, { player }, PopulatePlayerRegion);
}

async function InitColors() {
    let response = await fetch(`/colors`);
    game.colors = await response.json();
    
    let colorsDropDown = document.getElementById('colorsDropDown');
    for(let currentColor of Object.values(game.colors)){
        if(!currentColor.owner){
            CreateElement(colorsDropDown, 'beforeend', `<option value="${ currentColor.color }" name="color">${ currentColor.color }</option>`)
        }
    }
}

function MovePiece() {
    let selectedPiece = game.selectedPiece;

    if(!PieceMovement.ValidateMovement(this,selectedPiece)) return;

    let isOccuppied = true;

    if(this.querySelectorAll('.piece').length > 0){
        this.prepend(selectedPiece);
    }else{
        this.append(selectedPiece);
    }
    
    this.classList.remove('accesible-field');
    this.removeEventListener('click',MovePiece);

    selectedPiece.classList.remove('selected');
    let fieldId = this.id;
    setField(this,fieldId,isOccuppied);

    if(this.getAttribute('name') === Constants.PIECE_STATE_END){
        selectedPiece.removeEventListener('click',SelectPiece);
        WinGame();
        return;
    }else{}

    selectedPiece.addEventListener('click', SelectPiece);
    document.dispatchEvent(new CustomEvent(Constants.SOCKET_ACTION_MOVE_PIECE, {
        detail: {
            fieldId
        }
    }));

    game.canMove = false;
}

function WinGame() {
    alert('ENHORABUENA');
}

function PopulatePlayerRegion(player) {
    let region = document.getElementById(player.color);
    let home = region.querySelector('[name="home"]');
    let namePrompt = document.querySelector('#namePromptOverlay');
    let gameContainer = document.querySelector('#gameContainer');

    for (let piece of player.pieces) {
        let element = CreateElement(home, 'beforeend', `<span id="${player.color + piece.id}" class="dot piece ${player.color}" color="${player.color}" style=""></span>`);
        element.addEventListener('click', SelectPiece);
    }

    namePrompt.style.display = "none";
    gameContainer.style.display = "block";
}

function DeselectAllPieces() {
    const allPieces = document.querySelectorAll('.' + Constants.PIECE);
    for (let p of allPieces) {
        p.classList.remove('selected');
    }
}

function SelectPiece() {
    let selfColor = game.self ? game.self.color : undefined;
    if( !game.canMove || (!game.self && this.getAttribute('color') !== selfColor)) return;
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

function EmphasizeAccesibleFields(field) {
    UnSetAccesibleFields();
    field.classList.add('accesible-field');
    field.addEventListener('click', MovePiece);
}

function setField(field,id,isOccuppied,state,color) {
    let oldField = Object.values(game.fields).find(x => x.id == id);
    let oldField2 = Object.values(game.fields).find(x => x.id.toLowerCase().indexOf('specialZone') !== -1 && x.id == id);
    
    if (oldField) {
        oldField.isOccuppied = isOccuppied;
    }else{
        let fieldInfo = { id, isOccuppied };
        if(color){
            Object.defineProperty(fieldInfo, 'color', {
                value: color,
            });
        }
  
        if(state){
            Object.defineProperty(fieldInfo, 'state', {
                value: state,
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
const code = (new URLSearchParams(window.location.search)).get('id');
const ws = new WebSocket(`ws${location.protocol == "https:" ? 's' : ''}://${location.host}/transfer`);



// CSS EDITIING
let createModal = document.getElementById('create-modal');
let joinModal = document.getElementById('join-modal');
let nameModal = document.getElementById('name-modal');
let startChoice = document.getElementById('start-choice')
let closeCreate = document.getElementById("close-create");
let closeJoin = document.getElementById("close-join");

const createGameCss = () => {
    createModal.style.display = 'block';
}

const joinGameCss = () => {
    joinModal.style.display = 'block';
}

closeCreate.onclick = function () {
    createModal.style.display = "none";
}
closeJoin.onclick = function () {
    joinModal.style.display = "none";
}


window.onclick = function (event) {
    if (event.target == createModal || event.target == joinModal) {
        joinModal.style.display = "none";
        createModal.style.display = "none";
        startChoice.classList.remove('hidden')

    }
}

// CREATE/JOIN SCRIPT

ws.onopen = () => {
    console.log('ws opened')

    if (code === null) {
        document.getElementById('start').classList.remove('hidden')
    } else {
        document.getElementById('game').classList.remove('hidden')
        nameModal.style.display = 'block';
        //ws.send(JSON.stringify({ messageType: 2, body: { id: code } }))
    }
}

ws.onmessage = (e) => {
    console.log(e.data)
    const message = JSON.parse(e.data);
    switch (message.messageType) {
        case 0:
            window.location.href = `${location.href}?id=${message.body.id}`;
            break;
        case 1:
            console.log(message.body);
            break;
        case 2:
            linkModal.style.display = 'block';
            break;
        case 3:
            console.log('here');
            break;
    }
}

const createGame = () => {
    let size = document.querySelector('input[name="size"]:checked').value;
    let width, height, bombs;
    switch (parseInt(size)) {
        case 0:
            width = 9;
            height = 9;
            bombs = 10;
            break;
        case 1:
            width = 16;
            height = 16;
            bombs = 40
            break;
        case 2:
            width = 30;
            height = 16;
            bombs = 99
            break;
    }
    //let guesses = document.querySelector('input[name="guesses"]:checked').value;
    let guesses = true;
    //let name = document.getElementById('create-name').value;
    ws.send(JSON.stringify({ messageType: 0, body: { width: width, height: height, bombs: bombs, guesses: guesses, name: name } }))
}

const joinGame = () => {
    //let name = document.getElementById('join-name').value;
    //let id = document.getElementById('join-code').value;
    //ws.send(JSON.stringify({ messageType: 1, body: { name: name, id: id } }))
    let id = document.getElementById('join-code').value;
    window.location.href = `${location.href}?id=${id}`;
}

const setName = () => {
    let name = document.getElementById('name').value;
    ws.send(JSON.stringify({ messageType: 1, body: { name: name, id: code } }))
    nameModal.style.display = "none";
}
// GAME

//setup board

const canv = document.getElementById('board');
const ctx = canv.getContext('2d');

ctx.rect(100, 100, 600, 320);
ctx.stroke();

for (let i = 100; i < 700; i += 20) {
    for (let j = 100; j < 420; j += 20) {
        drawSquare(i, j, 0);
    }
}
ctx.stroke();

function drawSquare(x, y, value) {
    let sprite = new Image;
    sprite.src = '/sprites/TileUnknown.png';
    sprite.onload = () => {
        ctx.drawImage(sprite, x, y, 20, 20)
    }
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
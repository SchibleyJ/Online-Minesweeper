const code = (new URLSearchParams(window.location.search)).get('id');
const ws = new WebSocket(`ws${location.protocol == "https:" ? 's' : ''}://${location.host}/transfer`);

if (code === null) {
    document.getElementById('start').classList.remove('hidden')
} else {
    document.getElementById('game').classList.remove('hidden')

}

// CSS EDITIING
let createModal = document.getElementById('create-modal');
let joinModal = document.getElementById('join-modal');
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

// GAME SCRIPT

ws.onopen = () => {
    console.log('ws opened')
}

ws.onmessage = (e) => {
    console.log((e.data));
}

const createGame = () => {
    let size = document.querySelector('input[name="size"]:checked').value;
    let width, height, bombs;
    switch (parseInt(size)){
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
    let name = document.getElementById('create-name').value;
    ws.send(JSON.stringify({ messageType: 0, body: { width: width, height: height, bombs: bombs, guesses: guesses, name: name } }))
}
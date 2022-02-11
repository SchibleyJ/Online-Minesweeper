const code = (new URLSearchParams(window.location.search)).get('id');
if (code === null){
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

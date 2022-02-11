let createModal = document.getElementById('create-modal');
let joinModal = document.getElementById('join-modal');
let startChoice = document.getElementById('start-choice')
    
const createGameCss = () => {
    //startChoice.classList.add('hidden')

    createModal.style.display = 'block';
}

const joinGameCss = () => {
    //startChoice.classList.add('hidden')

    joinModal.style.display = 'block';
}

let span = document.getElementById("close");
span.onclick = function () {
    joinModal.style.display = "none";
    createModal.style.display = "none";
    startChoice.classList.remove('hidden')

}

window.onclick = function (event) {
    if (event.target == createModal || event.target == joinModal) {
        joinModal.style.display = "none";
        createModal.style.display = "none";
        startChoice.classList.remove('hidden')

    }
}
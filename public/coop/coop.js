const code = (new URLSearchParams(window.location.search)).get('id');
const ws = new WebSocket(`ws${location.protocol == "https:" ? 's' : ''}://${location.host}/transfer`);



// CSS EDITIING
let createModal = document.getElementById('create-modal');
let joinModal = document.getElementById('join-modal');
let nameModal = document.getElementById('name-modal');
let startChoice = document.getElementById('start-choice')
let closeCreate = document.getElementById("close-create");
let closeJoin = document.getElementById("close-join");

let bombs;
let surroundings;
let clicks;
let flags;
let boardWidth;
let boardHeight;


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
        ws.send(JSON.stringify({ messageType: 2, body: { id: code } }));

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
            bombs = message.body.bombs;
            surroundings = message.body.surroundings;
            clicks = message.body.clicks;
            flags = message.body.flags;
            boardWidth = message.body.width;
            boardHeight = message.body.height;

            loadBoard();
            break;
        case 2:
            if (!message.body) {
                alert("This game id does not exist.")
                window.location.href = location.href.substring(0, location.href.indexOf("?"));
            } else {
                document.getElementById('game').classList.remove('hidden')
                nameModal.style.display = 'block';
            }
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
    ws.send(JSON.stringify({ messageType: 0, body: { width: width, height: height, bombs: bombs, guesses: guesses } }))
}

const joinGame = () => {
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

const VERTICAL_MARGIN = 100;
const HORIZONTAL_MARGIN = 100;
const SQUARE_SIZE = 20;
const BORDER_SIZE = 0.625 * SQUARE_SIZE;

setTimeout(() => {
    loadImages();
}, 1000)
const loadBoard = () => {
    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            drawSquare(i, j);
        }
    }
    ctx.stroke();

}

canv.addEventListener('mousedown', (event) => {
    let rect = canv.getBoundingClientRect(); // abs. size of element
    let scaleX = canv.width / rect.width;    // relationship bitmap vs. element for X
    let scaleY = canv.height / rect.height;  // relationship bitmap vs. element for Y
    let mouseX = (event.clientX - rect.left) * scaleX;   // scale mouse coordinates after they have
    let mouseY = (event.clientY - rect.top) * scaleY;     // been adjusted to be relative to element

    let x = Math.floor((mouseX - HORIZONTAL_MARGIN) / SQUARE_SIZE);
    let y = Math.floor((mouseY - VERTICAL_MARGIN) / SQUARE_SIZE);
    if (x >= 0 && x < boardWidth && y >= 0 && y < boardHeight) {
        if (event.button === 0) {
            ws.send(JSON.stringify({ messageType: 3, body: { id: code, x: x, y: y } }))
        }
        if (event.button === 2) {
            ws.send(JSON.stringify({ messageType: 4, body: { id: code, x: x, y: y } }))
        }
    }

})



function drawSquare(x, y) {
    let isClicked = clicks[y][x];
    let isBomb = bombs[y][x];
    let surrouding = surroundings[y][x];
    let flag = flags[y][x];
    let sprite = new Image;
    if (!isClicked) {
        if (flag !== 0) {
            sprite.src = `/sprites/TileFlag${flag % 7}.png`;
        } else {
            sprite.src = '/sprites/TileUnknown.png';
        }
    } else if (isBomb) {
        sprite.src = '/sprites/TileMine.png';
    } else {
        sprite.src = `/sprites/Tile${surrouding}.png`;
    }

    sprite.onload = () => {
        ctx.drawImage(sprite, x * SQUARE_SIZE + HORIZONTAL_MARGIN, y * SQUARE_SIZE + VERTICAL_MARGIN, SQUARE_SIZE, SQUARE_SIZE)
    }
}



function loadImages() {
    let sprites = [];
    for (let i = 1; i < 9; i++) {
        const sprite = new Image;
        sprite.src = `/sprites/Border${i}.png`;
        sprites.push(sprite);
    }
    for (let i = 0; i < sprites.length; i++){
        sprites[i].onload = () => {
            console.log('here' + i);
            drawHelper(sprites)
        }
    }
   
}


function drawHelper(sprites) {
    console.log('here')
    //middle left "corner"
    ctx.drawImage(sprites[6], HORIZONTAL_MARGIN - BORDER_SIZE, VERTICAL_MARGIN - BORDER_SIZE, BORDER_SIZE, BORDER_SIZE)

    //middle right "corner"
    ctx.drawImage(sprites[7], boardWidth * SQUARE_SIZE + HORIZONTAL_MARGIN, VERTICAL_MARGIN - BORDER_SIZE, BORDER_SIZE, BORDER_SIZE)

    //bottm left corner
    ctx.drawImage(sprites[2], HORIZONTAL_MARGIN - BORDER_SIZE, boardHeight * SQUARE_SIZE + VERTICAL_MARGIN, BORDER_SIZE, BORDER_SIZE)

    //bottom right corner
    ctx.drawImage(sprites[3], boardWidth * SQUARE_SIZE + HORIZONTAL_MARGIN, boardHeight * SQUARE_SIZE + VERTICAL_MARGIN, BORDER_SIZE, BORDER_SIZE)

    //top/bottom wall
    for (let i = 0; i < boardWidth; i++) {
        ctx.drawImage(sprites[4], i * SQUARE_SIZE + HORIZONTAL_MARGIN, VERTICAL_MARGIN - BORDER_SIZE, SQUARE_SIZE, BORDER_SIZE)
        ctx.drawImage(sprites[4], i * SQUARE_SIZE + HORIZONTAL_MARGIN, boardHeight * SQUARE_SIZE + VERTICAL_MARGIN, SQUARE_SIZE, BORDER_SIZE)
        ctx.drawImage(sprites[4], i * SQUARE_SIZE + HORIZONTAL_MARGIN, VERTICAL_MARGIN - (2 * SQUARE_SIZE) - BORDER_SIZE, SQUARE_SIZE, BORDER_SIZE)

    }

    //left/right wall   
    for (let i = 0; i < boardHeight; i++) {
        ctx.drawImage(sprites[5], HORIZONTAL_MARGIN - BORDER_SIZE, i * SQUARE_SIZE + VERTICAL_MARGIN, BORDER_SIZE, SQUARE_SIZE)
        ctx.drawImage(sprites[5], boardWidth * SQUARE_SIZE + HORIZONTAL_MARGIN, i * SQUARE_SIZE + VERTICAL_MARGIN, BORDER_SIZE, SQUARE_SIZE)
    }
    ctx.drawImage(sprites[5], HORIZONTAL_MARGIN - BORDER_SIZE, VERTICAL_MARGIN - (2 * SQUARE_SIZE), BORDER_SIZE, 2 * SQUARE_SIZE)
    ctx.drawImage(sprites[5], boardWidth * SQUARE_SIZE + HORIZONTAL_MARGIN, VERTICAL_MARGIN - (2 * SQUARE_SIZE), BORDER_SIZE, 2 * SQUARE_SIZE)

    ctx.drawImage(sprites[0], HORIZONTAL_MARGIN - BORDER_SIZE, VERTICAL_MARGIN - (2 * SQUARE_SIZE) - BORDER_SIZE, BORDER_SIZE, BORDER_SIZE)
    ctx.drawImage(sprites[1], boardWidth * SQUARE_SIZE + HORIZONTAL_MARGIN, VERTICAL_MARGIN - (2 * SQUARE_SIZE) - BORDER_SIZE, BORDER_SIZE, BORDER_SIZE)

    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(HORIZONTAL_MARGIN, VERTICAL_MARGIN - (2 * SQUARE_SIZE), boardWidth * SQUARE_SIZE, 2 * SQUARE_SIZE);
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
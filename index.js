//https://stackoverflow.com/questions/1738128/minesweeper-solving-algorithm

/* TODO
add num of mines remaining (based on flags put down)
add timer
consider solvable board (starting with above link)
if you hate yourself, better html/css, keep the artstyle

*/


//websocket server 
const WebSocket = require('ws');
const server = require('http').createServer();
const app = require('./httpServer.js');
const port = process.env.PORT || 8080;

const Board = require('./board.js');
const floodFill = require('./floodFill.js');

const coopGames = {};

const wss = new WebSocket.Server({ server: server, path: '/transfer' });

server.on('request', app);

wss.on('connection', (client) => {
    client.on('message', (e) => {
        let message = JSON.parse(e);
        console.log(message)
        switch (message.messageType) {
            case 0:
                let id = Math.floor(Math.random() * 1000);
                coopGames[id] = new Board(id, message.body.width, message.body.height, message.body.bombs);
                //coopGames[id].addClient(client)
                //client['userData'] = { name: message.body.name, gameId: id }
                client.send(JSON.stringify({ messageType: 0, body: { id: id } }));
                break;
            case 1:
                coopGames[message.body.id].addClient(client)
                client['userData'] = { name: message.body.name, gameId: message.body.id, color: coopGames[message.body.id].clients.length }
                
                
                sendBoard(message.body.id);

                break;
            case 2:
                client.send(JSON.stringify({ messageType: 2, body: (coopGames[message.body.id] != undefined) }));
                break;
            case 3:
                let xClick = message.body.x;
                let yClick = message.body.y;
                if (!coopGames[message.body.id].clicks[yClick][xClick] && !coopGames[message.body.id].flags[yClick][xClick]) {
                    console.log('here')
                    if (coopGames[message.body.id].firstTurn){
                        coopGames[message.body.id].firstTurn = false;
                        coopGames[message.body.id].createBombs(xClick, yClick);
                        coopGames[message.body.id].createSurrounding(coopGames[message.body.id].bombs);
                        coopGames[message.body.id].startTimer(timerFunction, message.body.id);
                    }
                    floodFill(xClick, yClick, coopGames[message.body.id].clicks, coopGames[message.body.id].surroundings, coopGames[message.body.id].flags);
                    coopGames[message.body.id].updateFlagCount();
                    coopGames[message.body.id].checkGameOver();
                    
                sendBoard(message.body.id);

                }
                break;
            case 4:
                let xFlag = message.body.x;
                let yFlag = message.body.y;
                console.log('here')
                if (!coopGames[message.body.id].clicks[yFlag][xFlag]){
                    if (coopGames[message.body.id].flags[yFlag][xFlag] == 0){
                        coopGames[message.body.id].flags[yFlag][xFlag] = client['userData']['color'];
                        coopGames[message.body.id].numFlags++;
                    } else {
                        coopGames[message.body.id].flags[yFlag][xFlag] = 0;
                        coopGames[message.body.id].numFlags--;
                    }
                    sendBoard(message.body.id);
                }
                
                
                sendBoard(message.body.id);
                break;




        }

    })

})

const sendBoard = (id) => {
    wss.clients.forEach(_client => {
        if (_client['userData'] && _client['userData']['gameId'] == id) {
            _client.send(JSON.stringify({
                messageType: 1, body: {
                    numBombs: coopGames[id].numBombs,
                    numFlags: coopGames[id].numFlags,
                    bombs: coopGames[id].bombs,
                    surroundings: coopGames[id].surroundings,
                    clicks: coopGames[id].clicks,
                    flags: coopGames[id].flags,
                    width: coopGames[id].width,
                    height: coopGames[id].height,
                    seconds: coopGames[id].seconds,
                    gameOver: coopGames[id].winState
                }
            }));
        }
    })
}

const sendTime = (id) => {
    wss.clients.forEach(_client => {
        if (_client['userData'] && _client['userData']['gameId'] == id) {
            _client.send(JSON.stringify({
                messageType: 3, body: {
                    seconds: coopGames[id].seconds
                }
            }));
        }
    })
}

const timerFunction = (id) => {
    console.log('here')
    coopGames[id].seconds++;
    sendTime(id);
}


server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`);
});
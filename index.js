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
                
                client.send(JSON.stringify({
                    messageType: 1, body: {
                        bombs: coopGames[message.body.id].bombs,
                        surroundings: coopGames[message.body.id].surroundings,
                        clicks: coopGames[message.body.id].clicks,
                        flags: coopGames[message.body.id].flags,
                        width: coopGames[message.body.id].width,
                        height: coopGames[message.body.id].height
                    }
                }));

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
                        coopGames[message.body.id].createSurrounding(coopGames[message.body.id].bombs)
                    }
                    floodFill(xClick, yClick, coopGames[message.body.id].clicks, coopGames[message.body.id].surroundings)
                    wss.clients.forEach(_client => {
                        if (_client['userData'] && _client['userData']['gameId'] == message.body.id) {
                            _client.send(JSON.stringify({
                                messageType: 1, body: {
                                    bombs: coopGames[message.body.id].bombs,
                                    surroundings: coopGames[message.body.id].surroundings,
                                    clicks: coopGames[message.body.id].clicks,
                                    flags: coopGames[message.body.id].flags,
                                    width: coopGames[message.body.id].width,
                                    height: coopGames[message.body.id].height
                                }
                            }));
                        }
                    })

                }
                break;
            case 4:
                let xFlag = message.body.x;
                let yFlag = message.body.y;
                console.log('here')
                if (coopGames[message.body.id].flags[yFlag][xFlag] == 0){
                    coopGames[message.body.id].flags[yFlag][xFlag] = client['userData']['color'];
                } else {
                    coopGames[message.body.id].flags[yFlag][xFlag] = 0;
                }
                //coopGames[message.body.id].flags[yFlag][xFlag] = !coopGames[message.body.id].flags[yFlag][xFlag];
                wss.clients.forEach(_client => {
                    if (_client['userData'] && _client['userData']['gameId'] == message.body.id) {
                        _client.send(JSON.stringify({
                            messageType: 1, body: {
                                bombs: coopGames[message.body.id].bombs,
                                surroundings: coopGames[message.body.id].surroundings,
                                clicks: coopGames[message.body.id].clicks,
                                flags: coopGames[message.body.id].flags,
                                width: coopGames[message.body.id].width,
                                height: coopGames[message.body.id].height
                            }
                        }));
                    }
                })

                break;




        }

    })

})


server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`);
});
//websocket server 
const WebSocket = require('ws');
const server = require('http').createServer();
const app = require('./httpServer.js');
const port = process.env.PORT || 8080;

const Board = require('./board.js');
const res = require('express/lib/response');

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
                //client['userData'] = { name: message.body.name, gameId: id }
                client.send(JSON.stringify({ messageType: 0, body: { id: id } }));
                break;
            case 1:
                if (coopGames[message.body.id]) {
                    client['userData'] = { name: message.body.name, gameId: message.body.id }
                    client.send(JSON.stringify({
                        messageType: 1, body: {
                            bombs: coopGames[message.body.id].bombs,
                            surroundings: coopGames[message.body.id].surroundings,
                            clicks: coopGames[message.body.id].clicks,
                            flags: coopGames[message.body.id].flags
                        }
                    }));
                } else {
                    // client.send(JSON.stringify({ messageType: 1, body: "Game not found." }));

                }
                break;




        }

    })

})


server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`);
});
//websocket server 
const WebSocket = require('ws');
const server = require('http').createServer();
const app = require('./httpServer.js');
const port = process.env.PORT || 8080;

const Board = require('./board.js')

const vsGames = {};

const wss = new WebSocket.Server({ server: server, path: '/transfer' });

server.on('request', app);
 
wss.on('connection', (client) => {
    client.on('message', (e) => {
        let message = JSON.parse(e);
        console.log(message)
        switch (message.messageType){
            case 0:
                let id = Math.floor(Math.random() * 1000);
                vsGames[id] = new Board(id, message.body.width, message.body.height, message.body.bombs);
                client['userData'] = { gameId: id}
                break;
        }
        client.send(JSON.stringify(vsGames[client['userData']['gameId']].bombs))
    })

})


server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`);
});
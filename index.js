//websocket server 
const WebSocket = require('ws');
const server = require('http').createServer();
const app = require('./httpServer.js');
const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ server: server, path: '/transfer' });

server.on('request', app);
 
wss.on('connection', (client) => {
    client.send('hello!')
})

server.listen(port, function () {
    console.log(`http/ws server listening on ${port}`);
});
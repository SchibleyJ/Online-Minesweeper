//express server
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/public/sprites/'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index/index.html');
});

app.get('/vs', (req, res) => {
    res.sendFile(__dirname + '/public/vs/vs.html');
});

app.get('/coop', (req, res) => {
    res.sendFile(__dirname + '/public/coop/coop.html');
});

module.exports = app;

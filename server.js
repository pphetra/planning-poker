var express = require('express');
var _ = require('underscore');

var app = express.createServer();
var io = require('socket.io').listen(app);

app.use(express.logger({format: 'dev'}));
app.use(express.cookieParser('secret'));
app.use(express.bodyParser());
app.use(express.session({ secret: "spay developement" }));
app.use(express.static(__dirname + '/public'));

app.get('/player/new', function(req, res) {
    _(sockets).each(function(socket) {
        console.log(req.query);
        socket.emit('newPlayer', {
            name: req.query.name
        });
    });
    res.send('ok');
});

app.get('/player/card', function(req, res) {
    _(sockets).each(function(socket) {
        socket.emit('setCard', {
            name: req.query.name,
            card: req.query.card
        });
    });
    res.send('ok');
});

app.get('/player/flip', function(req, res) {
    _(sockets).each(function(socket) {
        socket.emit('flip', {
            name: req.query.name,
            card: req.query.card
        });
    });
    res.send('ok');
});

var sockets = [];
io.sockets.on('connection', function (socket) {
    sockets.push(socket);
});

app.listen(1358);

var mdns = require('mdns');
var ad = mdns.createAdvertisement(mdns.tcp('http'), 1358);
ad.start();
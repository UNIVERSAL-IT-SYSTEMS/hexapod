var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules/jquery'));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(1337);

io.on('connection', function (client) {
    console.log('connected!');
    client.on('move', function (data) {
        console.log(data);
        switch (data) {
            case 'forward':
                phoenix.walk();
                break;
            case 'crawl':
                phoenix.crawl();
                break;
            case 'turnLeft':
                phoenix.turn('left');
                break;
            case 'turnRight':
                phoenix.turn('right');
                break;
            case 'stand':
                phoenix.stand();
                break;
            case 'sleep':
                phoenix.sleep();
                break;
            case 'stop':
                phoenix.stop();
                break;
        }
    });
});
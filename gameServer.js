var conf =require('./config.js');
var app = require('./app.js');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var game =require("./game.js")(io);
server.listen(conf.serverPort);



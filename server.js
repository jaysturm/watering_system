const express = require('express');
const server = express();

var defaultRoute = require('./route_methods/index');
var water = require('./route_methods/water');
var powerStrip = require('./route_methods/powerStrip');

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use('/', defaultRoute);
server.use('/water', water);
server.use('/sockets', powerStrip);

// // catch 404 and forward to error handler
// server.use((req, res, next) => {
//     var err = new Error('404 - Not Found');
//     err.status = 404;
//     next(err);
// });

server.configure(function(){
  server.use(express.bodyParser());
});

server.listen(5555, () => {
    console.log("Server running at http://127.0.0.1:5555/");
});

module.exports = server;
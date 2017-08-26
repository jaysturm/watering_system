const express = require('express');
const server = express();
var bodyParser = require('body-parser');
var gpioUtil = require('./services/gpio.service');
var winston = require('winston');
var fs = require('fs');

winston.configure({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: './wonka_api.log' })
    ]
  }
);

var defaultRoute = require('./route_methods/index');
var water = require('./route_methods/water');
var powerStrip = require('./route_methods/powerStrip');

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use(bodyParser.json());

server.use('/', defaultRoute);
// server.use('/water', water);
server.use('/sockets', powerStrip);

server.use('/logs', (req, res) => {
    fs.readFile('./wonka_api.log', 'utf8', (err, data) => {
        if (err) {
            winston.error('Error getting logs', err);

            res.send(err);
        } else {
            res.send(data);
        }

        res.end();
    });
});

// // catch 404 and forward to error handler
// server.use((req, res, next) => {
//     var err = new Error('404 - Not Found');
//     err.status = 404;
//     next(err);
// });

server.listen(5555, () => {
    // set up rpio and gpio pins
    var allOutputPins = [3, 5, 7, 11, 13, 15, 19, 21];
    gpioUtil.initOutPins(allOutputPins);

    console.log("Server running at http://127.0.0.1:5555/");
});

module.exports = server;

var rpio = require('rpio');
var express = require('express');
var router = express.Router();
var gpioUtil = require('../services/gpio.service');
var winston = require('winston');
var fs = require('fs');
var sockets = null;
var sockets_path = './resources/sockets.json';

fs.readFile(sockets_path, 'utf8', (err, data) => {
    if (err)
       winston.error('Error getting contents of sockets json', err);
    else
        sockets = JSON.parse(data);
});

// middleware
router.use((req, res, next) => {
    // console.log('PowerStrip API middleware hit');
    next();
});

router.get('/', (req, res) => {
    res.send(sockets);
    res.end();
});

// params >>
// powerOn : boolean
// socket : 1 - 8
router.post('/', (req, res) => {
    try {
        if (req.body == undefined) {
            res.send('no parameters present');
            res.end();
            return;
        }

        var onOff = req.body.powerOn ? 'on' : 'off',
            socket = getSocket(req.body.socket),
            pin = socket.pin;

        winston.info(`**** turning socket ${req.body.socket} ${onOff} ****`)

        // change socket power state
        rpio.write(pin, req.body.powerOn ? gpioUtil.turnOn : gpioUtil.turnOff);

        // set socket state
        socket.state = req.body.powerOn;

        winston.info(`**** finished turning power ${onOff} ****`);

        res.send(sockets);
        res.end();
    } catch (err) {
        winston.error('*** error changing socket power state ****', err);
        res.send(`error changing socket power state => ${err}`);
        res.end();
    }
});

// change socket name
router.post('/name', (req, res) => {
    try {
        if (req.body == undefined) {
            res.send('no parameters present');
            res.end();
            return;
        }

        var name = req.body.name,
            socket = getSocket(req.body.socket);

        winston.info(`**** changing socket ${req.body.socket}'s name to ${name} ****`);

        socket.name = name;
        saveSockets();

        winston.info(`**** finished changing socket ${req.body.socket}'s name to ${name} ****`);

        res.send(sockets);
        res.end();
    } catch (err) {
        winston.error('**** error changing socket power state ****', err);
        res.send(`error changing socket power state => ${err}`);
        res.end();
    }
});

saveSockets = () => {
    fs.writeFile(sockets_path, JSON.stringify(sockets), (err) => {
        if (err)
            winston.error('**** error saving sockets json ****', err);
        else
            winston.info('**** sockets json saved successfully ****');
    });
};

getSocket = (socket) => {
    let socketIndex = -1;

    for (var i = 0; i < sockets.length; i++) {
        if (sockets[i].socket === socket) {
            socketIndex = i;
            break;
        }
    }

    return sockets[socketIndex];
};

module.exports = router;
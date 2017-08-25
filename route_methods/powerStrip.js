var rpio = require('rpio');
var express = require('express');
var router = express.Router();
var gpioUtil = require('../services/gpio.service');
var winston = require('winston');
var sockets = new Socket[];

require('fs').readFile('..resources/sockets.json', 'utf8', (err, data) => {
    if (err)
       winston.error('Error getting contents of sockets json', err);

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

        let socketIndex = -1;

        for (var i = 0; i < sockets.length; i++) {
            if (sockets[i].socket == req.body.socket) {
                socketIndex = i;
                break;
            }
        }

        var onOff = req.body.powerOn ? 'on' : 'off',
            socket = sockets[socketIndex],
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

module.exports = router;
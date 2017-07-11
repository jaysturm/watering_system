var rpio = require('rpio');
var express = require('express');
var router = express.Router();
var gpioUtil = require('../services/gpio.service');

var sockets =
[
    { "pin": 3, "socket": 1, "state": false },
    { "pin": 5, "socket": 2, "state": false },
    { "pin": 7, "socket": 3, "state": false },
    { "pin": 11, "socket": 4, "state": false },
    { "pin": 13, "socket": 5, "state": false },
    { "pin": 15, "socket": 6, "state": false },
    { "pin": 19, "socket": 7, "state": false },
    { "pin": 21, "socket": 8, "state": false }
];

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
            pin = sockets[req.body.socket].pin;

        console.log(`**** turning socket ${req.body.socket} ${onOff} ****`)

        // change socket power state
        rpio.write(pin, req.body.powerOn ? gpioUtil.turnOn : gpioUtil.turnOff);

        // set socket state
        let socketIndex = -1;

        for (var i = 0; i < sockets; i++) {
            if (sockets[i].pin == pin) {
                socketIndex = i;
                break;
            }
        }

        sockets[socketIndex].state = req.body.powerOn;

        console.log(`**** finished turning power ${onOff} ****`);

        res.send(sockets);
        res.end();
    } catch (err) {
        console.log('*** error changing socket power state ****', err);
        res.send(`error changing socket power state => ${err}`);
        res.end();
    }
});

module.exports = router;
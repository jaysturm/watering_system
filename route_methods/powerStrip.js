var rpio = require('rpio');
var express = require('express');
var router = express.Router();
var gpioUtil = require('../services/gpio.service');

var sockets =
{
    "1" : { "pin": 3, "state": false },
    "2" : { "pin": 5, "state": false },
    "3" : { "pin": 7, "state": false },
    "4" : { "pin": 11, "state": false },
    "5" : { "pin": 13, "state": false },
    "6" : { "pin": 15, "state": false },
    "7" : { "pin": 19, "state": false },
    "8" : { "pin": 21, "state": false },
};

// middleware
router.use((req, res, next) => {
    // console.log('PowerStrip API middleware hit');
    next();
});

// params >>
// powerOn : boolean
// socket : 1 - 8
router.post('/', (req, res) => {
    try {
        console.log(`req body => ${req.body}`);

        if (req.body == undefined) {
            res.send('no req body present');
            res.end();
            return;
        }

        var onOff = req.body.powerOn ? 'on' : 'off',
            pin = sockets[req.body.socket].pin;

        console.log(`**** turning socket ${req.body.socket} ${onOff} ****`)

        // change socket power state
        rpio.write(pin, req.body.powerOn ? gpioUtil.turnOn : gpioUtil.turnOff);

        // set socket state
        sockets[req.body.socket].state = req.body.powerOn;

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
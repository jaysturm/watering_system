var rpio = require('rpio');
var express = require('express');
var router = express.Router();
var gpioUtil = require('../services/gpio.service');

var sockets =
{
    "1" : 3,
    "2" : 5,
    "3" : 7,
    "4" : 11,
    "5" : 13,
    "6" : 15,
    "7" : 19,
    "8" : 21
},
    turnOn = rpio.LOW,
    turnOff = rpio.HIGH,
    outputPins = [3, 5, 7, 11, 13, 15, 19, 21];

// params >>
// powerOn : boolean
// socket : 1 - 8
router.post('/', (req, res) => {
    try {
        var onOff = req.body.powerOn ? 'on' : 'off',
            pin = sockets[req.body.socket];

        console.log(`**** turning socket ${req.body.socket} ${onOff} ****`)

        // set up rpio and gpio pins
        gpioUtil.initOutPins(outputPins);

        // change socket power state
        rpio(pin, req.body.powerOn ? turnOn : turnOff);

        console.log(`**** finished turning power ${onOff} ****`);
    } catch (err) {
        console.log('*** error changing socket power state ****', err);
        res.send(`error changing socket power state => ${err}`);
        res.end();
    }
});
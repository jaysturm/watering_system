var rpio = require('rpio');
var express = require('express');
var router = express.Router();

// watering cycle settings
var dispensed = 0, // water dispensed thus far (flow meter pulses)
    amountToDispense = 60, // desired pulses (don't know how much water per pulse yet)
    pulsesPerGallon = 60,
    zoneToWater = -1, // which zone to water
    turnOn = rpio.LOW,
    turnOff = rpio.HIGH;

// pins
var waterPump = 3,
    solenoidValve = 5,
    relay3 = 7,
    relay4 = 11,
    flowSensor = 27,
    outputPins = [waterPump, solenoidValve, relay3, relay4];

// middleware
router.use((req, res, next) => {
    // console.log('Watering API middleware hit');
    next();
});

router.get('/', (req, res) => {
    res.send('no watering cycles currently running.');
    res.end();
});

router.post('/', (req, res) => {
    try {
        console.log('**** starting watering cycle ****');

        // set up flow sensor pin and register handler
        // rpio.open(flowSensor, rpio.INPUT, rpio.PULL_UP);
        // rpio.poll(flowSensor, pulse_handler);

        // start watering cycle
        start_water();

        // uncomment once water flow sensor is hooked up
        // while (dispensed < amountToDispense) {
        //     console.log('watering...');
        // }

        rpio.sleep(10);

        // stop watering cycle
        stop_water();

        res.send('watering cycle complete.');
        res.end();
    } catch (err) {
        console.log('>> error watering => ', err);
        res.send('error occured during watering cycle.');
        res.end();
    }

    console.log('**** ending watering cycle ****');
    console.log('');
});

function pulse_handler(channel) {
    console.log('>> pulse channel => ' + channel);
    dispensed++;
}

function start_water() {
    // open valve and turn on pump
    console.log('>> opening solenoid valve.');
    rpio.write(solenoidValve, turnOn);

    console.log('>> turning on water pump.');
    rpio.write(waterPump, turnOn);
}

function stop_water() {
    // reset dispensed amount
    dispensed = 0;

    // turn off water pump
    console.log('>> shutting off water pump.')
    rpio.write(waterPump, turnOff);

    // wait 10 seconds
    rpio.sleep(10);

    // close solenoid valve
    console.log('>> closing solenoid valve.');
    rpio.write(solenoidValve, turnOff);
}

module.exports = router;
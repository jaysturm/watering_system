var rpio = require('rpio');
var express = require('express');
var router = express.Router();

// watering cycle settings
var dispensed = 0, // water dispensed thus far (flow meter pulses)
    amountToDispense = 60, // desired pulses (don't know how much water per pulse yet)
    pulsesPerGallon = 60,
    zoneToWater = -1, // which zone to water
    turnOn = rpio.LOW,
    turnOff = rpio.HIGH,
    currentlyWatering = false;

// pins
var waterPump = 3,
    solenoidValve = 5,
    relay3 = 7,
    relay4 = 11,
    flowSensor = 27,
    allRelayPins = [waterPump, solenoidValve, relay3, relay4];

// middleware
router.use((req, res, next) => {
    // console.log('Watering API middleware hit');
    next();
});

router.get('/', (req, res) => {
    currentlyWatering ? res.send('Watering cycle currently running.') : res.send('No watering cycles currently running.');
    res.end();
});

router.post('/', (req, res) => {
    try {
        console.log('**** Starting watering cycle ****');
        currentlyWatering = true;

        rpio.init({
            gpiomem: false,
            mapping: 'physical'
        });

        // set up pins
        for (var i = 0; i < allRelayPins.length; i++) {
            rpio.open(allRelayPins[i], rpio.OUTPUT, rpio.PULL_DOWN);
        }

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

        res.send('Watering cycle complete.');
        res.end();
    } catch (err) {
        console.log('error watering => ', err);
        res.send('Error occured during watering cycle.');
        res.end();
    }

    currentlyWatering = false;
    console.log('**** Ending watering cycle ****');
    console.log('');
});

function pulse_handler(channel) {
    console.log('Channel => ' + channel);
    dispensed++;
}

function start_water() {
    // open valve and turn on pump
    console.log('Opening solenoid valve.');
    rpio.write(solenoidValve, turnOn);

    console.log('Turning on water pump.');
    rpio.write(waterPump, turnOn);
}

function stop_water() {
    // reset dispensed amount
    dispensed = 0;

    // turn off water pump
    console.log('Shutting off water pump.')
    rpio.write(waterPump, turnOff);

    // wait 10 seconds
    rpio.sleep(10);

    // close solenoid valve
    console.log('Closing solenoid valve.');
    rpio.write(solenoidValve, turnOff);
}

module.exports = router;
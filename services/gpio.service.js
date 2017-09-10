var rpio = require('rpio');

module.exports = {
  initOutPins: (pins, down) => {
    rpio.init({
        gpiomem: false,
        mapping: 'physical'
    });

    // set up pins
    for (var i = 0; i < pins.length; i++) {
        rpio.open(pins[i], rpio.OUTPUT, down ? rpio.PULL_DOWN : rpio.PULL_UP);
    }
  },
  turnOn: rpio.LOW,
  turnOff: rpio.HIGH
};
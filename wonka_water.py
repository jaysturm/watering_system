#!/usr/bin/python
import RPi.GPIO as GPIO
import time, datetime as dt, sched

GPIO.setmode(GPIO.BCM)

turnOn = GPIO.LOW
turnOff = GPIO.HIGH

strain1 = "Moby Dick"

r1 = 2
r2 = 3
r3 = 4
r4 = 17

# set cycle variables

waterAmount = 1 # gallons per cycle
delayInterval = 60 # hours between cycle

# init list with pin numbers

pinList = [r1, r2, r3 ,r4]

# loop through pins and set mode and state to 'low'

for i in pinList: 
    GPIO.setup(i, GPIO.OUT) 
    GPIO.output(i, turnOff)

# function which defines and schedules a fresh watering cycle

def start_fresh_water(scheduler, strain):
  print "\nOpening fresh water valve for " + strain +" plant " + dt.datetime.now().strftime("%B %d, %Y %I:%M%p")

  GPIO.output(r1, turnOn)

  time.sleep(60)

  print "Closing fresh water valve for " + strain + " plant " + dt.datetime.now().strftime("%B %d, %Y %I:%M%p")

  GPIO.output(r1, turnOff)

  scheduler.enter(delayInterval, 1, start_fresh_water, (scheduler,))

# main loop

try:
  print "\n>>>> Starting watering system <<<<"

  sch = sched.scheduler(time.time, time.sleep)

  start_fresh_water(sch, strain1)

  sch.run()

  GPIO.cleanup()

# End program cleanly with keyboard
except KeyboardInterrupt:
  print "\n>>>> Stopping watering system <<<<\n"

  # Reset GPIO settings
  GPIO.cleanup()

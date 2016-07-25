# Phoenix Hexapod

This project contains instructions to port [phoenix.js](https://github.com/rwaldron/javascript-robotics/blob/master/Buck.Animation/phoenix.js) 
(code to control a Lynxmotion Phoenix hexapod with Johnny-Five) to be able to run on Windows IoT Core with Node.js (ChakraCore).

## Hardware

The hardware used is similar to what is used in the original phoenix.js project. The difference is that instead of 
attaching the servos to an Arduino, they are attached to servo hats connected to the Raspberry Pi. This is achieved,
with the help of the Johnny-Five [IO Plugin](https://github.com/rwaldron/io-plugins) feature.

* [Lynxmotion Phoenix](http://www.lynxmotion.com/p-947-phoenix-3dof-hexapod-no-electronics.aspx)
* 2 Adafruit 16-Channel PWM/Servo Hats (In this project 2 are used for the 18 servos to fit)
* SINOLLC DC 12V 24V to 5V 10A 50W Converter Step Down Regulator
* Raspberry Pi 2 with [Windows IoT Core](https://developer.microsoft.com/en-us/windows/iot/Downloads)

## Software

The software is similar to what is used in the original phoenix.js project. The only change in phoenix.js will be
to initialize Johnny-Five with an IO plugin. 
The IO plugin we use (win-io) is only useful for this project. It just handles i2c reads/writes to control the servos provided with 
the hexapod. A proper IO plugin does much more than that.
The code in [server.js](./server.js) can also be added to phoenix.js as a way to control the hexapod from a simple Express website.

## Instructions to run

### Install/Copy Node.js (ChakraCore)

* Install node-chakracore from [here](http://aka.ms/nodechakracore)
* Use [File Explorer](https://developer.microsoft.com/en-us/windows/iot/win10/samples/smb) to copy the arm version of node-chakracore to 
  the Raspberry Pi (unzip files in node-chakracore-arm.zip and copy to C:\nodejs on the Pi)
* We need to patch* gyp so that i2c-bus npm package can be built after running 'npm install.' i2c-bus is used by win-io to do 
  i2c reads/writes to the servos. To patch:
   * Replace \<node-chakracore install path\>\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\generator\msvs.py with [msvs.py](./gyp/msvs.py)
   * Replace \<node-chakracore install path\>\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\MSVSSettings.py with [MSVSSettings.py](./gyp/MSVSSettings.py)

*The change we are applying can be seen [here](https://chromium.googlesource.com/external/gyp/+/02b145a1a4f4e1c62e8bae06045caf852d9ef17f) the 
reason we patch is because the change hasn't made it to the node-chakracore repository yet.

### Prepare the code

#### phoenix.js
* Clone this repository and go to the root in a command window
* Copy [phoenix.js](https://github.com/rwaldron/javascript-robotics/blob/master/Buck.Animation/phoenix.js) to your clone root
* Open phoenix.js in a editor and make the following changes:
  * Add `var winio = require('win-io');` at the beginning of the file.
  * Change `board = new five.Board()` to `board = new five.Board({ io: new winio()})`
  * Optionally add the code in [server.js](./server.js) if you want to send commands to the hexapod through a simple Express server. If you do this,
    also add the IP address of your Pi to [index.html](./index.html)
* Run `npm install --target_arch=arm`

#### win-io
* Copy [constants.js](https://github.com/BrianGenisio/win-io/blob/master/lib/constants.js) to \<clone root\>\node_modules\win-io\lib
* Copy [win-io.js](https://github.com/BrianGenisio/win-io/blob/master/lib/win-io.js) to \<clone root\>\node_modules\win-io\lib
* Follow instructions in [patch.js](./patch.js) to modify win-io.js
* Run `npm install sleep --target_arch=arm`


### Run phoenix.js

* Use [File Explorer](https://developer.microsoft.com/en-us/windows/iot/win10/samples/smb) to copy the clone to the Raspberry Pi
  to c:\hexapod.
* Connect to your device with [SSH](https://developer.microsoft.com/en-us/windows/iot/win10/samples/ssh) or 
  [PowerShell](https://developer.microsoft.com/en-us/windows/iot/win10/samples/powershell)
* Run `netsh advfirewall firewall add rule name="node.js" dir=in action=allow program="C:\nodejs\node.exe" enable=yes` 
  (this step is only needed if you'll be running the server code)
* Run `c:\nodejs\node.exe c:\hexapod\phoenix.js`

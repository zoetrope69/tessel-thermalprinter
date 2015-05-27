# Thermal Printer for Tessel
Support for the A2 micro panel thermal printer module for Tessel.

### Important Information Specific to Module

1. power printer with 5-9v supply (seperate to Tessel)
2. update baudrate in code (you can find this on the test print by holding button on printer while powering)
3. use A, B, D ports. c doesn't support uart. ground (printer) to ground (tessel pin 0), rx (printer) to tx/g1 (tessel pin 8)
4. see example code for usage and original thermal printer for usage of the printer stuff: https://github.com/xseignard/thermalPrinter

### Installation
```sh
npm install tessel-thermalprinter
```

### Example
```js
// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
Support for the A2 micro panel thermal
printer module for Tessel.
*********************************************/

var tessel = require('tessel');
var thermalprinter = require('../'); // Replace '../' with 'ir-attx4' in your own code
var printer = thermalprinter.use(
    tessel.port['A'],
    {

        baudrate: 19200,

        // Max printing dots (0-255), unit: (n+1)*8 dots, default: 7 ((7+1)*8 = 64 dots)
        maxPrintingDots: 7,
        /* The more max heating dots, the more peak current will cost when printing,
         * the faster printing speed. The max heating dots is 8*(n+1).
         */

        // Heating time (3-255), unit: 10µs, default: 80 (800µs)
        heatingTime: 80,
        /* The more heating time, the more density, but the slower printing speed.
         * If heating time is too short, blank page may occur.
         */

        // Heating interval (0-255), unit: 10µs, default: 2 (20µs)
        heatingInterval: 2,
        /* The more heating interval, the more clear, but the slower printing speed.
         */
    }
);

printer.on('ready', function(){
    console.log('printer ready');
    printer
        .printLine('hello world')
        .print(function(){
            console.log('printer finished');
            process.exit();
        });
});
```

### Methods

_todo_

### Events

&#x20;<a href="#api-printer-on-ready-callback-Emitted-upon-reset-and-printing-settings-on-printer" name="api-printer-on-ready-callback-Emitted-upon-reset-and-printing-settings-on-printer">#</a> printer<b>.on</b>( 'ready', callback() )  
 Emitted upon reset and printing settings on printer.  


### Further Examples  

_todo_

### Hardware specifications and Advanced Information

_todo_

### Licensing  
MIT or Apache 2.0

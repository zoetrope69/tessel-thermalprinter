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

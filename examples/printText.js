var tessel = require('tessel');
var port = tessel.port['A'];
var uart = new port.UART({ baudrate: 19200 }); // baudrate for printer

var Printer = require('../src/printer.js');
var printer = new Printer(uart, {

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
});

printer.on('ready', function(){
    console.log('printer ready');
    printer
        .printLine('hello world')
        .print(function(){
            console.log('printer finished');
            process.exit();
        });
});

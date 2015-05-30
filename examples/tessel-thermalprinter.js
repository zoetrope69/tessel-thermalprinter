// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
Support for the A2 micro panel thermal
printer module for Tessel.
*********************************************/

var tessel = require('tessel');
var thermalprinter = require('../'); // Replace '../' with 'tessel-thermalprinter' in your own code
var printer = thermalprinter.use(tessel.port['A']);

printer.on('ready', function(){

    console.info('Printer ready!');

    printer
        .center()
        .horizontalLine(16)
        .printLine("we're printing with")
        .inverse(true)
        .big(true)
        .printLine(' TESSEL! ')
        .big(false)
        .inverse(false)
        .lineFeed(3)
        .print(function(){
            console.info('Printer finished!');
            process.exit();
        });

});

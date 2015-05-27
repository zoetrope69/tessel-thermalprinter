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
    console.log('printer ready');
    printer
        .printLine('hello world')
        .print(function(){
            console.log('printer finished');
            process.exit();
        });
});

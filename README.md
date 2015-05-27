# Thermal Printer for Tessel
Support for the A2 micro panel thermal printer module for Tessel.

### Important Information Specific to Module

1. power printer with 5-9v supply (seperate to Tessel)
2. update baudrate in code (you can find this on the test print by holding button on printer while powering)
3. use A, B, D ports. c doesn't support uart. ground (printer) to ground (tessel pin 0), rx (printer) to tx/g1 (tessel pin 8)
4. see example code for usage and original thermal printer for usage of the printer stuff: https://github.com/xseignard/thermalPrinter

+ [User manual](http://www.adafruit.com/datasheets/A2-user%20manual.pdf)
+ [Product sheet](http://www.adafruit.com/datasheets/cashino%20thermal%20printer%20a2.pdf)
+ Buy in [US (Adafruit)](https://www.adafruit.com/products/597) / [UK (Hobbytronics)](http://www.hobbytronics.co.uk/thermal-printer)

### Installation
```sh
npm install tessel-thermalprinter
```

### Example
```js
var tessel = require('tessel');
var thermalprinter = require('tessel-thermalprinter');
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
```

### Methods

_todo_

&#x20;<a href="#api-printer-setMaxPrintingDots-maxPrintingDots-callback" name="api-printer-setMaxPrintingDots-maxPrintingDots-callback">#</a> printer<b>.setMaxPrintingDots</b>( maxPrintingDots, callback() )  
Set the max printing dots (0-255), unit: (n+1)*8 dots, default: 7 ((7+1)*8 = 64 dots)
_The more max heating dots, the more peak current will cost when printing, the faster printing speed. The max heating dots is 8*(n+1)._

&#x20;<a href="#api-printer-setHeatingTime-heatingTime-callback" name="api-printer-setHeatingTime-heatingTime-callback">#</a> printer<b>.setHeatingTime</b>( heatingTime, callback() )  
Set the heating time (3-255), unit: 10µs, default: 80 (800µs)
_The more heating time, the more density, but the slower printing speed. If heating time is too short, blank page may occur._

&#x20;<a href="#api-printer-setHeatingInterval-heatingInterval-callback" name="api-printer-setHeatingInterval-heatingInterval-callback">#</a> printer<b>.setHeatingInterval</b>( heatingInterval, callback() )  
Set the heating interval (0-255), unit: 10µs, default: 2 (20µs)
_The more heating interval, the more clear, but the slower printing speed._

&#x20;<a href="#api-printer-print-callback" name="api-printer-print-callback">#</a> printer<b>.print</b>( callback() )  
Runs commands and prints

### Events

&#x20;<a href="#api-printer-on-ready-callback" name="api-printer-on-ready-callback">#</a> printer<b>.on</b>( 'ready', callback() )  
Emitted upon reset and printing settings on printer.


### Further Examples  

If you want to set options you can do so like this:

```js
// ...

var printer = thermalprinter.use(tessel.port['A'], {

	// baudrate for the printer default: 19200
	baudrate: 19200,
	/* can be found by doing a print test. hold the button printer while
	 * powering the printer on and it should spit out some shit at the
	 * bottom is it should say the baudrate
	 */

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

// ...
```

### Hardware specifications and Advanced Information

_todo_

### Licensing  
MIT or Apache 2.0

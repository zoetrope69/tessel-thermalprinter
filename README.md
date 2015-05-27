# Thermal Printer for Tessel
Support for the A2 micro panel thermal printer module for Tessel.

_this module is based on [xseignard's thermalprinter](https://github.com/xseignard/thermalPrinter) package_

### Important Information Specific to Module

+ Needs a seperate 5v - 9V, 2A power supply. The Tessel can't power this. 9V is faster.
+ You can do a test print by holding the printer button while powering.
+ A, B, D ports only. C doesn't support UART yet.
+ Wire it up so: Ground (printer) to Ground (Tessel: Pin 0), RX (printer) to RX/G1 (Tessel: Pin 8) _add pics later_

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

&#x20;<a href="#api-printer-setMaxPrintingDots-maxPrintingDots-callback" name="api-printer-setMaxPrintingDots-maxPrintingDots-callback">#</a> printer<b>.setMaxPrintingDots</b>( maxPrintingDots, callback() )
_Set the max printing dots (0-255), unit: (n+1)*8 dots, default: 7 ((7+1)*8 = 64 dots)_
> According to section 5.2.9 of the [datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf): "The more max heating dots, the more peak current will cost when printing, the faster printing speed. The max heating dots is 8*(n+1).""


&#x20;<a href="#api-printer-setHeatingTime-heatingTime-callback" name="api-printer-setHeatingTime-heatingTime-callback">#</a> printer<b>.setHeatingTime</b>( heatingTime, callback() )  
Set the heating time (3-255), unit: 10µs, default: 80 (800µs)
> According to section 5.2.9 of the [datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf): "The more heating time, the more density, but the slower printing speed. If heating time is too short, blank page may occur."


&#x20;<a href="#api-printer-setHeatingInterval-heatingInterval-callback" name="api-printer-setHeatingInterval-heatingInterval-callback">#</a> printer<b>.setHeatingInterval</b>( heatingInterval, callback() )  
Set the heating interval (0-255), unit: 10µs, default: 2 (20µs)
> According to section 5.2.9 of the [datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf): "The more heating interval, the more clear, but the slower printing speed."


&#x20;<a href="#api-printer-print-callback" name="api-printer-print-callback">#</a> printer<b>.print</b>( callback() )  
Runs commands and prints

_check the example, will add the rest later_

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

+ [Datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf)
+ [Productsheet](http://www.adafruit.com/datasheets/cashino%20thermal%20printer%20a2.pdf)

+ Buy in [US (Adafruit)](https://www.adafruit.com/products/597) / [UK (Hobbytronics)](http://www.hobbytronics.co.uk/thermal-printer)

+ Requires 5-9VDC @ 1.5Amp power supply during print
+ Protocol: TTL Serial, 19200 baud
+ Mean Cycles Before Failure: 5 million lines
+ Printing Speed: 50-80mm/s
+ Resolution: 8 dots/mm, 384 dots/line

#### Dimensions

+ Requires 2.25" wide, 50 ft or shorter thermal paper
+ Effective Printing Width: 48mm
+ Outline Dimension (WxDxH): 111x65x57mm
+ Installation Port Size: 103 x 57mm

#### Character set

+ Character Set: ASCII,GB2312-80(Chinese)
+ Print Font: ANK:5×7, Chinese: 12x24,24×24

#### Paper

+ Paper Type: Thermal paper
+ Paper Width: 57.5 ±0.5mm
+ Paper Roll Diameter: max 39mm

#### Temperatures

+ Operating Temp: 5°C ~ 50°C
+ Operating Humidity: 10% ~ 80%
+ Storage Temp: -20°C ~ 60°C
+ Storage Humidity: 10% ~ 90%

#### Other libraries

Don't have a Tessel? As this uses serial it works with most things:

+ [Python (Raspberry Pi)](https://github.com/adafruit/Python-Thermal-Printer)
+ [Arduino](https://github.com/adafruit/Adafruit-Thermal-Printer-Library)

### Licensing  
MIT or Apache 2.0

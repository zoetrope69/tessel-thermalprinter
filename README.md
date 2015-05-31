# Thermal printer module for Tessel

Support for the A2 micro panel thermal printer module for Tessel.

_This module is based on [xseignard's thermalprinter](https://github.com/xseignard/thermalPrinter) package_

### Important Information Specific to Module

+ Needs a seperate 5v - 9V, 2A power supply. The Tessel can't power this. 9V is faster.
+ You can do a test print by holding the printer button while powering.

### Installation
```sh
npm install tessel-thermalprinter
```
+ A, B, D ports only. C doesn't support UART yet.
+ Wire it up so: Ground (printer) to Ground (Tessel: Pin 0), RX (printer) to RX/G1 (Tessel: Pin 8)

![Wiring diagram for the project](/images/diagram.png)

### Examples
```js
var tessel = require('tessel');
var thermalprinter = require('tessel-thermalprinter');
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
        .lineFeed(3)
        .print(function(){
            console.info('Printer finished!');
            process.exit();
        });

});
```

For [the Last.fm example](/examples/lastfm.js) you'll need to add a api key. You can [get one here on their website](http://www.last.fm/api).

### Methods

#### Settings

&#x20;<a href="#api-printer-setMaxPrintingDots-maxPrintingDotsValue-callback" name="api-printer-setMaxPrintingDots-maxPrintingDotsValue-callback">#</a> printer<b>.setMaxPrintingDots</b>( maxPrintingDotsValue, callback() )  
_Set the max printing dots (0-255). _Default: 7 (( 7 + 1 ) * 8 = 64dots). Unit: ( n + 1 ) * 8dots_
> According to section 5.2.9 of the [datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf): "The more max heating dots, the more peak current will cost when printing, the faster printing speed. The max heating dots is 8 * ( n + 1 ).""


&#x20;<a href="#api-printer-setHeatingTime-heatingTimeValue-callback" name="api-printer-setHeatingTime-heatingTimeValue-callback">#</a> printer<b>.setHeatingTime</b>( heatingTimeValue, callback() )  
Set the heating time (3-255). _Default: 80 (800µs). Unit: 10µs._
> According to section 5.2.9 of the [datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf): "The more heating time, the more density, but the slower printing speed. If heating time is too short, blank page may occur."


&#x20;<a href="#api-printer-setHeatingInterval-heatingIntervalValue-callback" name="api-printer-setHeatingInterval-heatingIntervalValue-callback">#</a> printer<b>.setHeatingInterval</b>( heatingIntervalValue, callback() )  
Set the heating interval (0-255). _Default: 2 (20µs). Unit: 10µs._
> According to section 5.2.9 of the [datasheet](http://www.adafruit.com/datasheets/A2-user%20manual.pdf): "The more heating interval, the more clear, but the slower printing speed."


&#x20;<a href="#api-printer-setLineSpacing-spacing" name="api-printer-setLineSpacing-spacing">#</a> printer<b>.setLineSpacing</b>( spacing )  
Set the space between each printed line vertically

#### Main methods

&#x20;<a href="#api-printer-reset" name="api-printer-reset">#</a> printer<b>.reset</b>()  
Resets printer


&#x20;<a href="#api-printer-print-callback" name="api-printer-print-callback">#</a> printer<b>.print</b>( callback() )  
Runs commands and prints. _Run this last._


&#x20;<a href="#api-printer-printLine-text" name="api-printer-printLine-text">#</a> printer<b>.printLine</b>( text )  
Write text to printer


&#x20;<a href="#api-printer-lineFeed-amountOfLines" name="api-printer-lineFeed-amountOfLines">#</a> printer<b>.lineFeed</b>( amountOfLines )  
Feed blank lines out of the printer specified by argument


#### Printing modes

&#x20;<a href="#api-printer-bold-onOff" name="api-printer-bold-onOff">#</a> printer<b>.bold</b>( onOff )  
Makes text bolder


&#x20;<a href="#api-printer-big-onOff" name="api-printer-big-onOff">#</a> printer<b>.big</b>( onOff )  
Makes text bigger


&#x20;<a href="#api-printer-underline-onOff" name="api-printer-underline-onOff">#</a> printer<b>.underline</b>( onOff )  
Makes text underlined


&#x20;<a href="#api-printer-small-onOff" name="api-printer-small-onOff">#</a> printer<b>.small</b>( onOff )  
Makes text smaller


&#x20;<a href="#api-printer-upsideDown-onOff" name="api-printer-upsideDown-onOff">#</a> printer<b>.upsideDown</b>( onOff )  
Makes text upside down


&#x20;<a href="#api-printer-inverse-onOff" name="api-printer-inverse-onOff">#</a> printer<b>.inverse</b>( onOff )  
Makes text black on white


&#x20;<a href="#api-printer-left-onOff" name="api-printer-left-onOff">#</a> printer<b>.left</b>( onOff )  
Makes text aligned left


&#x20;<a href="#api-printer-right-onOff" name="api-printer-right-onOff">#</a> printer<b>.right</b>( onOff )  
Makes text aligned right


&#x20;<a href="#api-printer-center-onOff" name="api-printer-center-onOff">#</a> printer<b>.center</b>( onOff )  
Makes text aligned center


#### Images

_soooooon_

#### Barcodes

&#x20;<a href="#api-printer-barcodeTextPosition-positionValue" name="api-printer-barcodeTextPosition-positionValue">#</a> printer<b>.barcodeTextPosition</b>( positionValue )  
Set text position relative to barcode.
_Positions are:
0: Not printed
1: Above the barcode
2: Below the barcode
3: Both above and below the barcode_


&#x20;<a href="#api-printer-barcode-Printer-BARCODE_TYPES-type-barcodeData" name="api-printer-barcode-Printer-BARCODE_TYPES-type-barcodeData">#</a> printer<b>.barcode</b>( Printer.BARCODE_TYPES.type, barcodeData )  
Print barcode.
_The types you can use are: `UPCA, UPCE, EAN13, EAN8, CODE39, I25, CODEBAR, CODE93, CODE128, CODE11, MSI`_


#### Other

&#x20;<a href="#api-printer-indent-amountOfColumns" name="api-printer-indent-amountOfColumns">#</a> printer<b>.indent</b>( amountOfColumns )  
Create an indentation for text by an amount of cplumns


&#x20;<a href="#api-printer-horizontalLine-length" name="api-printer-horizontalLine-length">#</a> printer<b>.horizontalLine</b>( length )  
Draw a horizontal line at a certain length

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

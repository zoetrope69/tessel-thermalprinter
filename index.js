'use strict';
var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	async = require('async');

var Printer = function(port, opts, callback) {
	EventEmitter.call(this);

	opts = opts || {};

	// Max printing dots (0-255), unit: (n+1)*8 dots, default: 7 ((7+1)*8 = 64 dots)
	this.maxPrintingDots = opts.maxPrintingDots || 7;
	/* The more max heating dots, the more peak current will cost when printing,
	 * the faster printing speed. The max heating dots is 8*(n+1).
	 */

	// Heating time (3-255), unit: 10µs, default: 80 (800µs)
	this.heatingTime = opts.heatingTime || 80;
	/* The more heating time, the more density, but the slower printing speed.
	 * If heating time is too short, blank page may occur.
	 */

	// Heating interval (0-255), unit: 10µs, default: 2 (20µs)
	this.heatingInterval = opts.heatingInterval || 2;
	/* The more heating interval, the more clear, but the slower printing speed.
	 */

	// baudrate for the printer default: 19200
	this.baudrate = opts.baudrate || 19200;
	/* can be found by doing a print test. hold the button printer while
	 * powering the printer on and it should spit out some shit at the
	 * bottom is it should say the baudrate
	 */

	var uart = new port.UART({ baudrate: this.baudrate });

	// uart used by printer
	if (!uart.write) throw new Error('uart must have a write function');
	this.uart = uart;

	// command queue
	this.commandQueue = [];

	// printmode bytes (normal by default)
	this.printMode = 0;

	var _self = this;
	this.reset().sendPrintingParams().print(function() {
		_self.emit('ready');
	});
};
util.inherits(Printer, EventEmitter);

Printer.prototype.setMaxPrintingDots = function(maxPrintingDots, callback){
	this.maxPrintingDots = maxPrintingDots;
	this.sendPrintingParams();
	callback();
};

Printer.prototype.setHeatingTime = function(heatingTime, callback){
	this.heatingTime = heatingTime;
	this.sendPrintingParams();
	callback();
};

Printer.prototype.setHeatingInterval = function(heatingInterval, callback){
	this.heatingInterval = heatingInterval;
	this.sendPrintingParams();
	callback();
};

Printer.prototype.print = function(callback) {
	var _self = this;
	async.eachSeries(
		_self.commandQueue,
		function(command, callback) {
			_self.uart.write(command, callback);
		},
		function(err) {
			_self.commandQueue = [];
			callback();
		}
	);
};

Printer.prototype.writeCommand = function(command) {
	var buf;
	if (!Buffer.isBuffer(command)) {
		buf = new Buffer(1);
		buf.writeUInt8(command, 0);
	}
	else {
		buf = command;
	}
	this.commandQueue.push(buf);
	return this;
};

Printer.prototype.writeCommands = function(commands) {
	commands.forEach(function(command) {
		this.writeCommand(command);
	}, this);
	return this;
};

Printer.prototype.reset = function() {
	var commands = [27, 64];
	return this.writeCommands(commands);
};

Printer.prototype.sendPrintingParams = function() {
	var commands = [27,55,this.maxPrintingDots, this.heatingTime, this.heatingInterval];
	return this.writeCommands(commands);
};

Printer.prototype.lineFeed = function (linesToFeed) {
	var commands = linesToFeed ? [27, 100, linesToFeed] : [10];
	return this.writeCommands(commands);
};

Printer.prototype.addPrintMode = function(mode) {
	this.printMode |= mode;
	return this.writeCommands([27, 33, this.printMode]);
};

Printer.prototype.removePrintMode = function(mode) {
	this.printMode &= ~mode;
	return this.writeCommands([27, 33, this.printMode]);
};

Printer.prototype.bold = function (onOff) {
	return onOff ? this.addPrintMode(8) : this.removePrintMode(8);
};

Printer.prototype.big = function (onOff) {
	return onOff ? this.addPrintMode(56) : this.removePrintMode(56);
};

Printer.prototype.underline = function(dots){
	var commands = [27, 45, dots];
	return this.writeCommands(commands);
};

Printer.prototype.small = function(onOff){
	var commands = [27, 33, (onOff === true ? 1 : 0)];
	return this.writeCommands(commands);
};

Printer.prototype.upsideDown = function(onOff){
	var commands = [27, 123, (onOff === true ? 1 : 0)];
	return this.writeCommands(commands);
};

Printer.prototype.inverse = function (onOff) {
	var commands = onOff ? [29, 66, 1] : [29, 66, 0];
	return this.writeCommands(commands);
};

Printer.prototype.left = function () {
	var commands = [27, 97, 0];
	return this.writeCommands(commands);
};

Printer.prototype.right = function () {
	var commands = [27, 97, 2];
	return this.writeCommands(commands);
};

Printer.prototype.center = function () {
	var commands = [27, 97, 1];
	return this.writeCommands(commands);
};

Printer.prototype.indent = function(columns) {
	if (columns < 0 || columns > 31) {
		columns = 0;
	}
	var commands = [27, 66, columns];
	return this.writeCommands(commands);
};

Printer.prototype.setLineSpacing = function(lineSpacing) {
	var commands = [27, 51, lineSpacing];
	return this.writeCommands(commands);
};

Printer.prototype.horizontalLine = function(length) {
	var commands = [];
	if (length > 0) {
		if (length > 32) {
			length = 32;
		}
		for (var i = 0; i < length; i++) {
			commands.push(196);
		}
		commands.push(10);
	}
	return this.writeCommands(commands);
};

Printer.prototype.printLine = function (text) {
	var commands = [new Buffer(text), 10];
	return this.writeCommands(commands);
};

Printer.prototype.parseSpecialLine = function(text) {

	// this is the character codetable from the data sheet in a dodgy string
    var codeTable = 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧' +
                    'ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜' +
                    '╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄' +
                    '▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°··√ⁿ²■';

    var chars = text.split(''); // turn string into array of chars
    var commands = [];
    for(var i = 0; i < chars.length; i++){
        var char = chars[i];

        var charPos = codeTable.indexOf(char);

        // if the char is in the code table
        if( charPos != -1 ){
            // get the hex value and push it into new commands list
            commands.push(charPos + 128);
        }else{
			// otherwise it's probably normal text
            commands.push(new Buffer(char));
        }

    }

    commands.push(10); // flush command? cant remember but its in printLine

    return this.writeCommands(commands);

};

// Barcodes

// Set barcodeTextPosition
//
// Position can be:
// 0: Not printed
// 1: Above the barcode
// 2: Below the barcode
// 3: Both above and below the barcode
Printer.prototype.barcodeTextPosition = function(pos) {
	if(pos > 3 || pos < 0) {
		throw new Error('Position must be 0, 1, 2 or 3');
	}
	var commands = [29, 72, pos];
	return this.writeCommands(commands);
};

// Set barcode height
// 0 < h < 255 (default = 50)
Printer.prototype.barcodeHeight = function(h) {
	if(h > 255 || h < 0) {
		throw new Error('Height must be 0 < height > 255');
	}
	var commands = [29, 104, h];
	return this.writeCommands(commands);
};

Printer.BARCODE_CHARSETS = {
	NUMS: function(n) { return n >= 48 && n <= 57; },
	ASCII: function(n) { return n >= 0 && n <= 127; }
};

// These are all valid barcode types.
// Pass this object to printer.barcode() as type:
// printer.barcode(Printer.BARCODE_TYPES.UPCA, 'data');
Printer.BARCODE_TYPES = {
	UPCA : {
		code: 65,
		size: function(n) { return n === 11 || n === 12; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	},
	UPCE : {
		code: 66,
		size: function(n) { return n === 11 || n === 12; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	},
	EAN13 : {
		code: 67,
		size: function(n) { return n === 12 || n === 13; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	},
	EAN8 : {
		code: 68,
		size: function(n) { return n === 7 || n === 8; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	},
	CODE39 : {
		code: 69,
		size: function(n) { return n > 1; },
		chars: function(n) {
			// " $%+-./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			return (
				n === 32 ||
				n === 36 ||
				n === 37 ||
				n === 43 ||
				(n >= 45 && n <= 57) ||
				(n >= 65 && n <= 90)
			);
		}
	},
	I25 : {
		code: 70,
		size: function(n) { return n > 1 && n % 2 === 0; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	},
	CODEBAR : {
		code: 71,
		size: function(n) { return n > 1; },
		chars: function(n) {
		// "$+-./0123456789:ABCD"
		return (
			n === 36 ||
			n === 43 ||
			(n >= 45 && n <= 58) ||
			(n >= 65 && n <= 68)
		);
		}
	},
	CODE93 : {
		code: 72,
		size: function(n) { return n > 1; },
		chars: Printer.BARCODE_CHARSETS.ASCII
	},
	CODE128 : {
		code: 73,
		size: function(n) { return n > 1; },
		chars: Printer.BARCODE_CHARSETS.ASCII
	},
	CODE11 : {
		code: 74,
		size: function(n) { return n > 1; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	},
	MSI : {
		code: 75,
		size: function(n) { return n > 1; },
		chars: Printer.BARCODE_CHARSETS.NUMS
	}
};

Printer.prototype.barcode = function(type, data) {
	var error;
	var commands = [29, 107];
	commands.push(type.code);
	commands.push(data.length);

	// Validate size
	if(!type.size(data.length)) {
		error = new Error('Data length does not match specification for this type of barcode');
		error.name = "invalid_data_size";
		throw error;
	}
	// validate that the chars to be printed are supported for this type of barcode
	for(var i=0; i < data.length; i++) {
		var code = data.charCodeAt(i);
		if(!type.chars(code)) {
			error = new Error('Character ' + code + ' is not valid for this type of barcode');
			error.name = "invalid_character";
			error.char = code;
			throw error;
		}
		commands.push(code);
	}
	return this.writeCommands(commands);
};

function use(port, opts, callback){
	return new Printer(port, opts, callback);
}

/**
 * Public API
 */

exports.Printer = Printer;
exports.use = use;

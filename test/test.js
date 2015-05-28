var test = require('tinytap');
var async = require('async');

var tessel = require('tessel');
var thermalprinter = require('../');

var port = process.argv[2] || 'A';

var printer;

test.count(6);

async.series([

	test('Connecting to tessel-thermalprinter', function (t){

		printer = thermalprinter.use(tessel.port[port]);

		t.ok(typeof printer == 'object', 'printer should be an object');

		printer.on('error', function (error){
		  t.ok(false, 'Error caught: ' + error);
		  t.end();
		});

	})

]);

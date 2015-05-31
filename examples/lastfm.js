var tessel = require('tessel');
var thermalprinter = require('../'); // Replace '../' with 'tessel-thermalprinter' in your own code
var printer = thermalprinter.use(tessel.port['A']);

var http = require('http');
var util = require('util');

var lastfm = {
    apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // get your key here http://www.last.fm/api
    username: 'zaccolley'
};

printer.on('ready', function(){

    console.log('Printer ready!');
    console.log('Printing intro...');

    printer
        .setLineSpacing(24)
        .lineFeed(3)

        .parseSpecialLine("    ╔══════════════════════╗    ")
        .parseSpecialLine("    ║▒╔══════════════════╗▒║    ")
        .parseSpecialLine("    ║▒║                  ║▒║    ")
        .parseSpecialLine("╔═══╩═╩══════════════════╩═╩═══╗")
        .parseSpecialLine("║▓▒░░░░                  ░░░░▒▓║")
        .parseSpecialLine("│▒       last.fm tracks       ▒│")
        .parseSpecialLine("│                              │")
        .parseSpecialLine("│   'get' for latest track     │")
        .parseSpecialLine("│   'quit' to........ quit     │")
        .parseSpecialLine("│                              │")
        .parseSpecialLine("╟──────────────────────────────╢")
        .parseSpecialLine("│  ·            ·           ·  │")
        .parseSpecialLine("│       You listened to:       │")
        .parseSpecialLine("└┐   ·          ·         ·   ┌┘")

        .print(function(){
            console.log('Printed!');
            console.log("Type 'get' for latest track");
            console.log("Type 'quit' to quit");
        });

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', function (text){

            console.log('Received input: ', util.inspect(text));

            if(text === 'get\n'){

                getLatestTrack(function(track){
                    console.log("You're listening to: ", track);
                    console.log("Printing latest track...");

                    printer
                        .parseSpecialLine(" ├ ─ ─ ─ ─ ─ ─ ── ─ ─ ─ ─ ─ ─ ┤ ")
                        .parseSpecialLine("┌┘                            └┐")
                        .parseSpecialLine("│  ∞   ≈   ⁿ        ²   ·   ÷  │")
                        .parseSpecialLine("│                              │")
                        .parseSpecialLine("│ " + pad(28, truncate(track.name, 28), ' ') + " │")
                        .parseSpecialLine("│ " + pad(28, truncate(track.artist, 28), ' ') + " │")
                        .parseSpecialLine("│ " + pad(28, truncate(track.album, 28), ' ') + " │")
                        .parseSpecialLine("│                              │")
                        .parseSpecialLine("│  ²   ·   ÷        ∞   ≈   ⁿ  │")
                        .parseSpecialLine("└┐                            ┌┘")

                        .print(function(){
                            console.log('Printed!');
                            console.log('Waiting for input...');
                            console.log("Type 'get' for latest track");
                            console.log("Type 'quit' to quit");
                        });
                });

            }else if(text === 'quit\n'){

                console.log("Printing bottom...");

                printer
                    .parseSpecialLine(" ├ ─ ─ ─ ─ ─ ─ ── ─ ─ ─ ─ ─ ─ ┤ ")
                    .parseSpecialLine("┌┘▒   ·        ·          ·░░▒└┐")
                    .parseSpecialLine("║▓▒░┌────┐░░░░░░░░░░░░┌────┐░▒▓║")
                    .parseSpecialLine("║▓▒┌┘▒░░▒└┐░╔══════╗░┌┘▒░░▒└┐▒▓║")
                    .parseSpecialLine("║▓▒│▒÷▒▒÷▒│░║ Θ¥¥Θ ║░│▒÷▒▒÷▒│▒▓║")
                    .parseSpecialLine("║▓▒└┐▒░░▒┌┘░╚══════╝░└┐▒░░▒┌┘▒▓║")
                    .parseSpecialLine("║▓▒░└────┘░░░░░░░░░░░░└────┘░▒▓║")
                    .parseSpecialLine("║▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓║")
                    .parseSpecialLine("╚══════════════════════════════╝")

                    .lineFeed(3)
                    .print(function(){
                        console.log('Printed!');
                        console.log('Quitting now. Bye bye. :¬)');
                        process.exit();
                    });


            }

        });

});

// string manipulation

function truncate(string, length){
    if( string.length > length ){
        return string.substring(0, length - 3) + '...';
    }else{
        return string;
    }
}

function pad(width, string, padding){
    return (width <= string.length) ? string : pad(width, string + padding, padding);
}

// last.fm junk

function getLatestTrack(callback){
    console.log("Getting the latest track!");

    // recent tracks
    var url = 'http://ws.audioscrobbler.com/2.0/' +
              '?method=user.getrecenttracks' +
              '&limit=1' +
              '&user=zaccolley' +
              '&api_key=fa5687767b9d45951f19973b88ff46d9' +
              '&format=json';

    http.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var json = JSON.parse(body);

            if(typeof json.recenttracks.track !== 'undefined'){ // if the json does exist (last.fm isn't borked)

        		callback({
                    name: json.recenttracks.track[0].name,
            		artist: json.recenttracks.track[0].artist["#text"],
            		album: json.recenttracks.track[0].album["#text"]
                });

        	}

        });

    }).on('error', function(e){
        console.log("Got error: ", e);
    });

}

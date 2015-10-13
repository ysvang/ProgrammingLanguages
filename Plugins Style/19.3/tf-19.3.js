// Ch19.3 NOT Plugins

var tfwords;
var tffreqs;
var fs = require('fs');
var ini = require('ini');

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
var words_option = config.Options.words;
var frequencies_option = config.Options.frequencies;

if (words_option === "words1.js") {
  tfwords = require("./words1.js");
} else {
  tfwords = require("./words2.js");
}

if(frequencies_option === "frequencies1.js") {
  tffreqs = require("./frequencies1.js");
} else {
  tffreqs = require("./frequencies2.js");
}

var word_freqs = tffreqs.top25(tfwords.extract_words(process.argv[2]));

for (var i in word_freqs.slice(0,25)){
    console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);   
}
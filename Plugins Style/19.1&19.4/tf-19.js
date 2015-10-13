// Ch19.1 + 19.4 Plugins

var tfwords;
var tffreqs;
var printing;

function load_plugins() {
    var fs = require('fs');
    var ini = require('ini');
    var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
    var words_plugin = config.Plugins.words;
    var frequencies_plugin = config.Plugins.frequencies;
    var printing_plugin = config.Plugins.printout;
    tfwords = require(words_plugin);
    tffreqs = require(frequencies_plugin);
    printing = require(printing_plugin);
}

load_plugins();
printing.print_out(tffreqs.top25(tfwords.extract_words(process.argv[2])));

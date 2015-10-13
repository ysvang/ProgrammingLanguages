// Author: Scott Vang
// Problem 20.1: Constructivist style

function exact_words(path_to_file){
    var str_data = "";
    if ((typeof(path_to_file) != "string") || !path_to_file) {
        return [];
    }
    try {
        var fs = require('fs');
        str_data = fs.readFileSync(path_to_file).toString().trim();
    } catch(e){
        console.log("I/O " + e.name + " when opening " + path_to_file + " " + e.message);
        return [];
    }
    
    var word_list = str_data.toLowerCase().replace(/[\W_]/g,' ').split(/\s+/);
    return word_list;
}

function remove_stop_words(word_list){
    var stop_words = {};
    var wordList = [];
    if (typeof(word_list) != "object") {
        return [];
    }
    try {
        var fs = require('fs');
        wordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
    } catch(e){
        console.log("I/O " + e.name + " when opening ../stop_words.txt " + e.message);
    }
    for (var i in wordList) {
	    stop_words[wordList[i]]=true;
    }
    
    var valid_word_list = [];
    for (var i in word_list) {
        if (!(word_list[i] in stop_words) && (word_list[i].length > 1)){
            valid_word_list.push(word_list[i]);
        }
    }
    return valid_word_list;
}

function frequencies(word_list){
    if ((typeof(word_list) != "object") || word_list === []){
        return {};
    }
    var word_freqs = {};
    for (var w in word_list){
        if (word_list[w] in word_freqs){
            word_freqs[word_list[w]] += 1;
        } else {
            word_freqs[word_list[w]] = 1;
        }
    }
    return word_freqs;
}

function sort(word_freq){
    if ((typeof(word_freq) != "object") || (word_freq === {})){
        return [];
    }
    var keys = [];
    for(var key in word_freq) {
        keys.push(key);
    }
    keys.sort(function(a, b) {
        return word_freq[b] - word_freq[a];
    });
    var wordfreqPair = [];
    for (var i in keys){
        wordfreqPair.push([keys[i], word_freq[keys[i]]]);
    }
    return wordfreqPair;
}

// The main function
var filename = "";
if (process.argv.length > 2) {
    filename = process.argv[2];
} else {
    filename = "../input.txt";
}

var word_freqs = sort(frequencies(remove_stop_words(exact_words(filename))));

for (var i in word_freqs.slice(0,25)){
    console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);   
}
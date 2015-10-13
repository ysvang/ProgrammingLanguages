// Author: Scott Vang
// Problem 21.1: Tantrum Style

function exact_words(path_to_file){
    var str_data = "";
    console.assert((typeof(path_to_file) === "string"), "I need a string");
    console.assert((path_to_file), "I need a non-empty string!");
    try {
        var fs = require('fs');
        str_data = fs.readFileSync(path_to_file).toString().trim();
    } catch(e){
        console.log("I/O " + e.name + " when opening " + path_to_file + ". " + e.message + "! I quit!");
        throw e;
    }
    
    var word_list = str_data.toLowerCase().replace(/[\W_]/g,' ').split(/\s+/);
    return word_list;
}

function remove_stop_words(word_list){
    var stop_words = {};
    var wordList = [];
    console.assert((typeof(word_list) === "object"), "I need an object!");

    try {
        var fs = require('fs');
        wordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
    } catch(e){
        console.log("I/O " + e.name + " when opening ../stop_words.txt!" + e.message + "! I quit!");
        throw e;
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
    console.assert((typeof(word_list) === "object"), "I need an object!");
    console.assert(word_list != [], "I need a non-empty object!");
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
    console.assert ((typeof(word_freq) === "object"), "I need an object!");
    console.assert (word_freq != {}, "I need a non-empty object!");
    
    try {
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
    } catch(e){
        console.log("Sorted threw error");
        throw e;
    }
}

// The main function
try{
    console.assert(process.argv.length > 2, "You idiot! I need an input file!");
    var word_freqs = sort(frequencies(remove_stop_words(exact_words(process.argv[2]))));
    
    console.assert(typeof(word_freqs) === "object", "OMG! This is not an object!");
    console.assert(word_freqs.length > 25, "SRSLY? Less than 25 words!");
    for (var i in word_freqs.slice(0,25)){
        console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);   
    }
} catch(e){
    console.log("Something wrong!");
    var stack = new Error().stack;
    console.log(stack);
}


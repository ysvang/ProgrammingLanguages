// Author: Scott Vang
// Problem 8.1: Kick Forward style

function read_file (path_to_file, func){
    var fs = require('fs');
    var data = fs.readFileSync(path_to_file).toString().trim();
    func(data, normalize);
}

function filter_chars (str_data, func){
    func(str_data.replace(/[\W_]/g,' '), scan);
}

function normalize(str_data, func){
    func(str_data.toLowerCase(), remove_stop_words);
}

function scan(str_data, func){
    func(str_data.split(/\s+/), frequencies);
}

function remove_stop_words (word_list, func) {
    var stop_words = {};
    var fs = require('fs');
    var stop_words_array = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
    for (var i in stop_words_array) {
	    stop_words[stop_words_array[i]]=true;
    }    
   
    var valid_word_list = [];
    for (var i in word_list) {
        if (!(word_list[i] in stop_words) && (word_list[i].length > 1)){
            valid_word_list.push(word_list[i]);
        }
    }
    func(valid_word_list, sort);
}

function frequencies (word_list, func){
    var wf = {};
    for (var w in word_list){
        if (word_list[w] in wf){
            wf[word_list[w]] += 1;
        } else {
            wf[word_list[w]] = 1;
        }
    }
    func(wf, print_text);
}

function sort(wf, func){
    var keys = [];
    for(var key in wf) {
        keys.push(key);
    }
    keys.sort(function(a, b) {
        return wf[b] - wf[a];
    });
    var wordfreq = [];
    for (var i in keys){
        wordfreq.push([keys[i], wf[keys[i]]]);
    }
    func(wordfreq, no_op);
}

function print_text (word_freqs, func){
    for (var i in word_freqs.slice(0,25)){
        console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);   
    }
    func(null);
}

function no_op(func){
    return;
}

// The main function
read_file(process.argv[2], filter_chars);
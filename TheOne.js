// Author: Scott Vang
// Problem 9.1: The One style

function TFTheOne(v) {
    this._value = v;
    var self = this;
    this.bind = function (func){
        self._value = func(self._value);
        return self;
    };
    
    this.printme = function (){
        console.log(self._value);
    };
}

function read_file(path_to_file) {
    var fs = require('fs');    
    var data = fs.readFileSync(path_to_file).toString().trim();
    return data;
}

function filter_chars(str_data) {
    var pattern = str_data.replace(/[\W_]/g,' ');
    return pattern;
}

function normalize(str_data) {
    return str_data.toLowerCase();
}

function scan(str_data) {
    return str_data.split(/\s+/);
}

function remove_stop_words(word_list) {
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
    return valid_word_list;
}

function frequencies(word_list){
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
    var keys = [];
    for(var key in word_freq) {
        keys.push(key);
    }
    keys.sort(function(a, b) {
        return word_freq[b] - word_freq[a];
    });
    var wordFreqPair = [];
    for (var i in keys){
        wordFreqPair.push([keys[i], word_freq[keys[i]]]);
    }
    return wordFreqPair;
}

function top25_freqs(word_freqs){
    var top25 = "";
    for (var i in word_freqs.slice(0,25)){
        top25 += word_freqs[i][0] + "  -  " + word_freqs[i][1] + '\n';   
    }
    return top25;
}

// The main program
new TFTheOne(process.argv[2])
.bind(read_file).bind(filter_chars)
.bind(normalize).bind(scan)
.bind(remove_stop_words)
.bind(frequencies)
.bind(sort)
.bind(top25_freqs)
.printme();
// Author: Scott Vang
// Problem 24.1 and 24.3: Quarantine Style

function TFQuarantine(func) {
    this._funcs = [func];
    var self = this;
    this.bind = function (func){
        self._funcs.push(func);
        return self;
    };
    
    this.execute = function (){
        var value = null;
        for (var i in self._funcs){
            value = self._funcs[i](value);
        }
    };
}

function get_input(arg) {
    var _f = function() {
        return process.argv[2];
    };
    return _f();
}

function extract_words(path_to_file) {
    var _f = function(){
        var fs = require('fs');    
        var word_list = fs.readFileSync(path_to_file).toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
        return word_list;
    };
    return _f();
}

function remove_stop_words(word_list) {
    var stop_words = {};
    var _f = function() {
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
    };
    return _f();
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
    function _print (){
        for (var i in word_freqs.slice(0,25)){
            console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);
        }
    }
    return _print();
}

// The main program
new TFQuarantine(get_input)
.bind(extract_words)
.bind(remove_stop_words)
.bind(frequencies)
.bind(sort)
.bind(top25_freqs)
.execute();
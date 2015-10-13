// Author: Scott Vang
// Problem 14.1: Infinite Mirror style

var RECURSIVE_LIMIT = 2000;

function count(word_list, stopwords, wordfreqs){
    if (word_list.length === 0){
        return;
    } else {
        var word = word_list[0];
        if (!(word in stopwords) && (word.length > 1)){
            if (word in wordfreqs){
                wordfreqs[word] += 1;
            } else {
                wordfreqs[word] = 1;
            }
        }
        count(word_list.splice(1), stopwords, wordfreqs);
    }
}

function wf_print (wordfreq){
    if (wordfreq.length === 0){
        return;
    } else {
        console.log(wordfreq[0][0] + "  -  " + word_freqs[wordfreq[0][0]]);
        wf_print (wordfreq.slice(1));
    }
}

// Read the stop-words file in and store stop words in an object (hashmap)
var stop_words = {};
var fs = require('fs');
var wordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
for (var i in wordList) {
	stop_words[wordList[i]]=true;
}

// Read the input file in and pass array of words into the count function to count
// frequencies
var words = fs.readFileSync(process.argv[2]).toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
var word_freqs = {};
for (var i = 0; i < words.length; i += RECURSIVE_LIMIT){
    count(words.slice(i, i+RECURSIVE_LIMIT), stop_words, word_freqs);
}

// Sorting code
var keys = [];
for(var key in word_freqs) {
    keys.push(key);
}
keys.sort(function(a, b) {
    return word_freqs[b] - word_freqs[a];
});
var wordfreq = [];
for (var i in keys){
    wordfreq.push([keys[i], word_freqs[keys[i]]]);
}

wf_print(wordfreq.slice(0,25));
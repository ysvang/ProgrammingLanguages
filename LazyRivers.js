// Author: Scott Vang
// Problem 27.1 and 27.2: Lazy Rivers Style


// function generates a string
function* characters(filename) {
    var lineByLine= require('n-readlines');
    var liner = new lineByLine(filename);
    var line;
    var lineNumber = 0;
    /* kind of weird syntax here but this is what the module 'n-readlines'
       specifies in order to read file line by line */
    while (line = liner.next()) {
        yield line.toString();
        lineNumber++;
    }
    
}

// function generates an array of words
function* all_words(filename) {
    var lineGen = characters(filename);
    var line = lineGen.next();
    while(!line.done) {
        yield (line.value.toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/));
        line = lineGen.next();
    }
}


// function generates a valid, alphanumeric word
function* non_stop_words(filename){
    var stopWords = {};
    var fs = require('fs');
    var stopWordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
    for (var i in stopWordList) {
    	stopWords[stopWordList[i]]=true;
    }
    
    var wordsGen = all_words(filename);
    var words = wordsGen.next();
    while(!words.done) {
        for (var w in words.value) {
            if (!(words.value[w] in stopWords) && (words.value[w].length > 1)) {
                yield words.value[w];
            }
        }
        words = wordsGen.next();
    }
}

// function returns sorted object by value in an array
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

// Function generates array of sorted term-frequency
function* count_and_sort(filename){
    var freqs = {};
    var i = 1;
    var nonStopWordGen = non_stop_words(filename);
    var nonStopWord = nonStopWordGen.next();
    while(!nonStopWord.done){
        if (nonStopWord.value in freqs) {
            freqs[nonStopWord.value] += 1;
        } else {
            freqs[nonStopWord.value] = 1;
        }
        if ((i % 5000 ) === 0) {
            yield sort(freqs);
        }
        i++;
        nonStopWord = nonStopWordGen.next();
    }
    yield sort(freqs);
}


var word_freqs_Gen = count_and_sort(process.argv[2]);
var word_freqs = word_freqs_Gen.next();
while (!word_freqs.done){
    console.log("--------------------------------");
    for (var i in word_freqs.value.slice(0,25)){
        console.log(word_freqs.value[i][0] + "  -  " + word_freqs.value[i][1]);   
    }
    word_freqs = word_freqs_Gen.next();
}



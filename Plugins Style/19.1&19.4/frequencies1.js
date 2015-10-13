// Ch19.1+Ch19.4 frequencies1 module

exports.top25 = function(word_list){
    var word_freqs = {};
    for (var w in word_list){
        if (word_list[w] in word_freqs){
            word_freqs[word_list[w]] += 1;
        } else {
            word_freqs[word_list[w]] = 1;
        }
    }
    
    var keys = [];
    for(var key in word_freqs) {
        keys.push(key);
    }
    keys.sort(function(a, b) {
        return word_freqs[b] - word_freqs[a];
    });
    var wordFreqPair = [];
    for (var i in keys){
        wordFreqPair.push([keys[i], word_freqs[keys[i]]]);
    }
    
    return wordFreqPair;
};
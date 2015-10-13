// Ch19.1+Ch19.4 frequencies2 module

exports.top25 = function(word_list){
    var word_freq = {};
    word_list.forEach(function(word){
    word_freq[word] = word_freq[word] + 1 || 1;
        });

    var sorted=[];
    for(var key in word_freq) {
        if(word_freq.hasOwnProperty(key)) {
            sorted.push([key, word_freq[key]]); 
        }
    }

    sorted.sort(function(a, b){
      return b[1]-a[1]; 
    });
    return sorted; 
};
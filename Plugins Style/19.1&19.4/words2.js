// Ch19.1+Ch19.4 words2 module

exports.extract_words = function (path_to_file){
    var fs = require('fs');
    var word_list = fs.readFileSync(path_to_file).toString().toLowerCase().match(/[a-z]{2,}/g);
    
    var stop_words_array = fs.readFileSync('../stop_words.txt').toString().split(",");
    var stop_words = stop_words_array.reduce(function(obj, i){
        obj[i] = true;
        return obj;
    },{});
    
    var valid_word_list = [];
    for (var i in word_list) {
        if (!stop_words.hasOwnProperty(word_list[i])){
            valid_word_list.push(word_list[i]);
        }
    }
    
    return valid_word_list;   
};
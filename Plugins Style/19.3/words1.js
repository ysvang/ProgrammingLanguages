// Ch19.3 words1 module

exports.extract_words = function (path_to_file){
    var stop_words = {};
    
    var fs = require('fs');
    var str_data = fs.readFileSync(path_to_file).toString().trim();
    var word_list = str_data.toLowerCase().replace(/[\W_]/g,' ').split(/\s+/);
    
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
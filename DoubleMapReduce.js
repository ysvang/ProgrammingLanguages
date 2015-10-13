// Author: Scott Vang
// Problem 31.1 and 31.3: Double Map Reduce Style

var fs = require('fs'); // module for file io

function read_file(path_to_file){
    var data = fs.readFileSync(path_to_file).toString();
    return data;
}


function partition(data_str, nlines){
    var lines = data_str.split('\n');
    var chunks = [];
    for (var i=0; i<lines.length; i+=nlines){
        chunks.push('\n' + lines.slice(i, i+nlines).join());
    }
    return chunks;
}


function split_words(data_str){
    function _scan(str_data){
        return str_data.toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
    }
    
    function _remove_stop_words(word_list){
        var stopWords = {};
        var stopWordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
        for (var i in stopWordList) {
	        stopWords[stopWordList[i]]=true;
        }
    
        var valid_word_list = [];
        for (var i in word_list) {
            if (!(word_list[i] in stopWords) && (word_list[i].length > 1)){
                valid_word_list.push(word_list[i]);
            }
        }
        return valid_word_list;   
    }
    
    var result = [];
    var words = _remove_stop_words(_scan(data_str));
    for (var w in words){
        result.push([words[w], 1]);
    }
    return result;   
}

// Regroup pairs into 5 groups
function regroup(pairs_list){
    var mapping = { 'a-e': [],
                    'f-j': [],
                    'k-o': [],
                    'p-t': [],
                    'u-z': []};
    for (var i in pairs_list){
        var pairs = pairs_list[i];
        for (var j in pairs){
            var p = pairs[j];
            var firstLetterASCII = p[0].charCodeAt(0);
            if((97 <= firstLetterASCII) && (firstLetterASCII <= 101)){
                mapping['a-e'].push(p);
            } else if ((102 <= firstLetterASCII) && (firstLetterASCII <= 106)){
                mapping['f-j'].push(p);
            } else if ((107 <= firstLetterASCII) && (firstLetterASCII <= 111)) {
                mapping['k-o'].push(p);
            } else if ((112 <= firstLetterASCII) && (firstLetterASCII <= 116)) {
                mapping['p-t'].push(p);
            } else if ((117 <= firstLetterASCII) && (firstLetterASCII <= 122)) {
                mapping['u-z'].push(p);
            } else {}
        }
    }
    return mapping;
}


function count_words(mapping){
    var map = {};
    var pairs = mapping[1];
    
    for (var i in pairs){
        var p = pairs[i];
        if (map.hasOwnProperty(p[0])){
            map[p[0]].push(p);
        } else {
            map[p[0]] = [p];
        }
    }
    var accumulatePairs = [];
    for (var key in map){
        var valueArray = [];
        var pair = map[key];
        for (var k in pair){
            valueArray.push(pair[k][1]);
        }
        accumulatePairs.push([key, valueArray.reduce(function(x,y){
            return x+y;
            })]);
    }
    return accumulatePairs;
}

// Auxiliary functions
function sort(word_freq){
    // flatten out 2-D array into 1-D
    word_freq = [].concat.apply([], word_freq);
    word_freq.sort(function(a, b) {
        return b[1] - a[1];
    });
    return word_freq;
}

// Main function
var splits = partition(read_file(process.argv[2]), 200).map(function(x){
        return split_words(x);
        });
var split_per_word_Map = regroup(splits);

// transform map to array to use map/reduce methods
var split_per_word_Array = Object.keys(split_per_word_Map).map(function(key) {
        return [key, split_per_word_Map[key]];
        });

var word_freqs = sort(split_per_word_Array.map(function(x){
        return count_words(x);
        }));

for (var i in word_freqs.slice(0,25)){
    console.log(word_freqs[i][0] + "  -  " + word_freqs[i][1]);
}
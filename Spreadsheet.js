// Author: Scott Vang
// Problem 26.1: Spreadsheet Style

var all_words = [[], null];
var stop_words = [{}, null];
var non_stop_words =[[], function(){
                            return all_words[0].map(
                                function(w){    
                                    return (!(w in stop_words[0]) && (w.length > 1)) ? w : "";
                                        });
                        }];

var unique_words = [{}, function() {
                            var uniqueWordSet = {};
                            for (var i in non_stop_words[0]) {
                                if (non_stop_words[0][i] != "") {
                                    uniqueWordSet[non_stop_words[0][i]] = true;
                                }
                            }
                            return uniqueWordSet;
                        }];

var counts = [[], function() { 
                    return Object.keys(unique_words[0]).map(
                        function (w_uniqueWords) {
                            return non_stop_words[0].filter(function(y_nonStopWords) {
                                return y_nonStopWords === w_uniqueWords; 
                                     }).length;
                        });
                    }];

var sorted_data = [[], function() {
                            var wordCountPairs = Object.keys(unique_words[0]).map(function(word, i) {
                                return [word, counts[0][i]];
                            });
                            // sort the pair in descending order of counts
                            return wordCountPairs.sort(function(x,y){
                                return y[1] - x[1];
                            });
                        }];

var all_columns = [all_words, stop_words, non_stop_words, unique_words, 
                    counts, sorted_data];
                 
function update(){
    for (var c in all_columns) {
        if (all_columns[c][1] != null) {
            all_columns[c][0] = all_columns[c][1]();
        }    
    }
}

var fs = require('fs');
all_words[0] = fs.readFileSync(process.argv[2]).toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
var stopWordsObject = {};
var stopWordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
for (var i in stopWordList) {
	stopWordsObject[stopWordList[i]]=true;
}
stop_words[0] = stopWordsObject;
update();

for (var i in sorted_data[0].slice(0,25)){
    console.log(sorted_data[0][i][0] + '  -  ' + sorted_data[0][i][1]);
}
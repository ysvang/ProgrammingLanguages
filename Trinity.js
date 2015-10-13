// Author: Scott Vang
// Problem 32.1: Trinity Style

var fs = require('fs');
var rl_sync = require("readline-sync");

function WordFrequenciesModel(path_to_file){
        this.freqs = {};
        var self = this;
        var stopWords = {};
        var stopWordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
        for (var i in stopWordList) {
            stopWords[stopWordList[i]]=true;
        }

        this.update = function(path_to_file){
            try{
                var words = fs.readFileSync(path_to_file).toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
                self.freqs = {};
                for (var i in words) {
                    if (!(words[i] in stopWords) && (words[i].length > 1)){
                            self.freqs[words[i]] = self.freqs[words[i]] + 1 || 1;
                    }
                } 
            } catch (e){
                console.log("File not found");
                self.freqs = {};
            }
        };
        this.update(path_to_file);
}

function WordFrequenciesView(model){
    this._model = model;
    var self = this;
    this.render = function() {
        var sorted_freqs = sorted(self._model.freqs);
        for (var i in sorted_freqs.slice(0,25)){
            console.log(sorted_freqs[i][0] + "  -  " + sorted_freqs[i][1]);   
        }
    };
    
    function sorted(word_freq){
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
}

function WordFrequenciesController(model, view){
    this._model = model;
    this._view = view;
    view.render();
    var self = this;
    
    this.run = function (){
        while (true){
            var filename = rl_sync.question('Next Files: ');
            self._model.update(filename);
            self._view.render();
        }
    };
}

var m = new WordFrequenciesModel(process.argv[2]);
var v = new WordFrequenciesView(m);
var c = new WordFrequenciesController(m, v);
c.run();

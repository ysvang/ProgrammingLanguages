// Author: Scott Vang
// Problem 14.2: Hollywood style with extension to return number of non-stop words with letter z.

function WordFrequencyFramework (){
    this._load_event_handlers = [];
    this._dowork_event_handlers = [];
    this._end_event_handlers =  [];
    var self = this;
    
    this.register_for_load_event = function (handler) {
        self._load_event_handlers.push(handler);
    };

    this.register_for_dowork_event = function (handler){
        self._dowork_event_handlers.push(handler);
    };
    
    this.register_for_end_event = function (handler){
        self._end_event_handlers.push(handler);
    };
    
    this.run = function (path_to_file){
        
        for (var h in self._load_event_handlers){
            self._load_event_handlers[h](path_to_file);
        }
        
        for (var h in self._dowork_event_handlers){
            self._dowork_event_handlers[h]();
        }
        
        for (var h in self._end_event_handlers){
            self._end_event_handlers[h]();
        }
    };
}

function DataStorage(waff, stop_word_filter){
    this._data = '';
    this._stop_word_filter = stop_word_filter;
    this._word_event_handlers = [];
    var self = this;

    this._load = function (path_to_file){
 	    var fs = require('fs');
	    var textFile = fs.readFileSync(path_to_file).toString().toLowerCase().trim();
	    self._data = textFile.replace(/[\W_]/g,' ');
    };
    
    this.produce_words = function() {
        var data_str = self._data;
        data_str = data_str.split(/\s+/);
        for (var i in data_str){
            if (!self._stop_word_filter.is_stop_word(data_str[i]) && (data_str[i].length > 1)){
                for (var h in self._word_event_handlers){
                    self._word_event_handlers[h](data_str[i]);
                }
            }
        }
    };

    this.register_for_word_event = function (handler) {
        self._word_event_handlers.push(handler);
    };
    
    waff.register_for_load_event(this._load);
    waff.register_for_dowork_event(this.produce_words);  
}

function StopWordFilter(wfapp) {
    this._stop_words =  {};
    var self = this;
    
    this._load = function(){
	    var fs = require('fs');
	    var wordList = fs.readFileSync('../stop_words.txt').toString().replace(/[\W_]/g,' ').trim().split(/\s+/);
	    for (var i in wordList) {
		    self._stop_words[wordList[i]]=true;
	    }
	};
    
    this.is_stop_word = function(word){
        return self._stop_words.hasOwnProperty(word);
    };
    
    wfapp.register_for_load_event(this._load);
}

function WordFrequencyCounter(wfapp, data_storage) {
    this._word_freqs =  {};
    var self = this;
    
    this.increment_count = function (word){
        if (word in self._word_freqs) {
            self._word_freqs[word] += 1;
        } else {
            self._word_freqs[word] = 1;
        } 
    };

    this.print_freqs = function (){
        var keys = [];
        
        for(var key in self._word_freqs) {
            if(self._word_freqs.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        
        keys.sort(function(a, b) {
            return self._word_freqs[b] - self._word_freqs[a];
        });
        
        for(var i in keys.slice(0,25)){
            console.log(keys[i] + "  -  " + self._word_freqs[keys[i]]);
        }   
    };
    
    data_storage.register_for_word_event(this.increment_count); 
    wfapp.register_for_end_event(this.print_freqs);
}

// function returns the number of non-stop words with the letter z
function Z_Word_Counter(wfapp, word_freq_counter) {
    this._word_freqs =  word_freq_counter._word_freqs;
    var self = this;
    
    this.print_number_z_words = function (){
        var number_of_z_words = 0;

        for(var word in self._word_freqs) {
            if(word.indexOf('z') != -1) {
                number_of_z_words += self._word_freqs[word];
            }
        }
        console.log("The number of non-stop words with letter z is: " + number_of_z_words);
    };
    
    wfapp.register_for_end_event(this.print_number_z_words);
}

var wfapp = new WordFrequencyFramework();
var stop_word_filter = new StopWordFilter(wfapp);
var data_storage = new DataStorage(wfapp, stop_word_filter);
var word_freq_counter = new WordFrequencyCounter(wfapp, data_storage);
var word_with_z_counter = new Z_Word_Counter(wfapp, word_freq_counter)
wfapp.run(process.argv[2]);
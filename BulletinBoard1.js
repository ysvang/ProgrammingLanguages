// Author: Scott Vang
// Problem 15.1: Bulletin Board

function EventManager (){
    this._subscriptions = {};
    var self = this;
    
    this.subscribe = function (event_type, handler) {
        if (event_type in self._subscriptions){
            self._subscriptions[event_type].push(handler);
        } else {
            self._subscriptions[event_type] = [handler];
        }
    };
        
    this.publish = function (event){
        var event_type = event[0];
        //console.log(event_type);
        if (event_type in self._subscriptions){
            for (var h in self._subscriptions[event_type]) {
                //console.log(h);
                //console.log(typeof(self._subscriptions[event_type][h]));
                self._subscriptions[event_type][h](event);
            }
        }
    };
}

function DataStorage(event_manager){
    this._data = '';
    var self = this;
    
    this.load = function (event){
        var path_to_file = event[1];
 	    var fs = require('fs');
	    var textFile = fs.readFileSync(path_to_file).toString().toLowerCase().trim();
	    self._data = textFile.replace(/[\W_]/g,' ');
    };
    
    this.produce_words = function(event) {
         var data_str = self._data;
        data_str = data_str.split(/\s+/);
        for (var i in data_str){
            self._event_manager.publish(['word', data_str[i]]);
        }
        self._event_manager.publish(['eof', null]);
    };
    
    this._event_manager = event_manager;
    this._event_manager.subscribe('load', this.load);
    this._event_manager.subscribe('start', this.produce_words);
}

function StopWordFilter(event_manager) {
    this._stop_words = {};
    var self = this;

    this.load = function(event){
	    var fs = require('fs');
	    var wordList = fs.readFileSync('../stop_words.txt').toString().replace(/[\W_]/g,' ').trim().split(/\s+/);
	    for (var i in wordList) {
		    self._stop_words[wordList[i]]=true;
	    }
	};
    
    this.is_stop_word = function(event){
        var word = event[1];
        if (!(word in self._stop_words) && (word.length > 1)){
            self._event_manager.publish(['valid_word', word]);
        }
    };
    
    this._event_manager = event_manager;
    this._event_manager.subscribe('load', this.load);
    this._event_manager.subscribe('word', this.is_stop_word);
}

function WordFrequencyCounter(event_manager) {
    this._word_freqs =  {};
    var self = this;
    
    this.increment_count = function (event){
        var word = event[1];
        if (word in self._word_freqs) {
            self._word_freqs[word] += 1;
        } else {
            self._word_freqs[word] = 1;
        } 
    };

    this.print_freqs = function (event){
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
    
    this._event_manager = event_manager;
    this._event_manager.subscribe('valid_word', this.increment_count);
    this._event_manager.subscribe('print', this.print_freqs);
}

function WordFrequencyApplication(event_manager) {
    var self = this;
    
    this.run = function (event){
        var path_to_file = event[1];
        self._event_manager.publish(['load', path_to_file]);
        self._event_manager.publish(['start', null]);
    };
    
    this.stop = function (event){
        self._event_manager.publish(['print', null]);
    };
    
    this._event_manager = event_manager;
    this._event_manager.subscribe('run', this.run);
    this._event_manager.subscribe('eof', this.stop);
}

// The main function
var em = new EventManager();
DataStorage(em);
StopWordFilter(em);
WordFrequencyCounter(em);
WordFrequencyApplication(em);
em.publish(['run', process.argv[2]]);
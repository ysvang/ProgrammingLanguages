// Author: Scott Vang
// Problem 33.1: Restful Style

var fs = require('fs');
var rl_sync = require("readline-sync");
var util = require("util");

var stops = {};
var stopWordList = fs.readFileSync('../stop_words.txt').toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
for (var i in stopWordList) {
    stops[stopWordList[i]]=true;
}
var data = {};

function error_state(){
    return ["Something wrong", ["get", "default", null]];
}

function default_get_handler(args){
    var rep = "What would you like to do?";
    rep += "\n1 - Quit" + "\n2 - Upload file";
    var links = {1 : ["post", "execution", null], 
                 2 : ["get", "file_form", null]};
    return [rep, links];
}

function quit_handler(args){
    console.log("Goodbye cruel world...");
    process.exit(0);
}

function upload_get_handler(args){
    return ["Name of file to upload?", ["post", "file"]];
}

function upload_post_handler(args){
    function create_data(filename){
        
        if (data.hasOwnProperty(filename)){
            return;
        }
        var word_freqs = {};
        var words = fs.readFileSync(filename).toString().toLowerCase().trim().replace(/[\W_]/g,' ').split(/\s+/);
        for (var i in words) {
            if (!(words[i] in stops) && (words[i].length > 1)){
                word_freqs[words[i]] = word_freqs[words[i]] + 1 || 1;
            }
        } 
        var word_freqs1 = Object.keys(word_freqs).map(function(key) {
                                                        return [key, word_freqs[key]];
                                                    });
        word_freqs1.sort(function(a, b){
                            return b[1]-a[1]; 
                        });
        data[filename] = word_freqs1;
    }
        
    if (args === undefined){
        return error_state(); 
    }
    var filename = args;
    try{
        create_data(filename);
    } catch (e) {
        return error_state();
    }
    return word_get_handlers([filename, 0]);
}

function word_get_handlers(args){
    function get_word(filename, word_index){
        if (word_index < data[filename].length){
            return data[filename][word_index];
        } else {
            return ["no more words", 0];
        }
    }
    
    var filename = args[0];
    var word_index = args[1];
    var word_info = get_word(filename, word_index);
    var rep = util.format('\n#%s: %s - %s', word_index+1, word_info[0], word_info[1]);
    rep += "\n\nWhat would you like to do next?";
    rep += "\n1 - Quit" + "\n2 - Upload file";
    rep += "\n3 - See next most-frequently occurring word";
    var links = {"1" : ["post", "execution", null],
                 "2" : ["get", "file_form", null],
                 "3" : ["get", "word", [filename, word_index+1]]};
    return [rep, links];
}


var handlers = {"post_execution" : quit_handler,
                "get_default" : default_get_handler,
                "get_file_form" : upload_get_handler,
                "post_file" : upload_post_handler,
                "get_word" : word_get_handlers};
                
function handle_request(verb, uri, args){
    function handler_key(verb, uri){
        return verb + "_" + uri;
    }
    
    if (handlers.hasOwnProperty(handler_key(verb, uri))){
        return handlers[handler_key(verb, uri)](args);
    } else {
        return handlers[handler_key("get", "default")](args);
    }
    
}

function render_and_get_input(state_representation, links){
    var input;
    console.log(state_representation);
    if (Array.isArray(links)){
        if (links[0] === "post"){
            input = rl_sync.question();
            links.push(input);
            return links;
        } else {
            return links;
        }
    } else if (typeof(links) === "object"){
        input = rl_sync.question();
        if (links.hasOwnProperty(input)){
            return links[input];
        } else {
            return ["get", "default", null]; 
        }
    } else {
        return ["get", "default", null];
    }
}

var request = ["get", "default", null];
var stateRepresentation_links = [];
while(true){
    stateRepresentation_links = handle_request(request[0], request[1], request[2]);
    request = render_and_get_input(stateRepresentation_links[0], stateRepresentation_links[1]);
}
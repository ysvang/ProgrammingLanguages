// Author: Scott Vang
// Problem 25.1 and 25.2: Persistent Tables Style
// Database Insertion file

// Create the relational database schema
function create_db_schema(){
  db.serialize(function() {
    db.run("CREATE TABLE documents (id INTEGER PRIMARY KEY AUTOINCREMENT, name)");
    db.run("CREATE TABLE words (id, doc_id, value)");
    db.run("CREATE TABLE characters (id, word_id, value)");
  });
}

function load_file_into_database(path_to_file){
  
    function _extract_words(path_to_file) {
	    var str_data = fs.readFileSync(path_to_file).toString().toLowerCase().trim();
	    var word_list = str_data.replace(/[\W_]/g,' ').split(/\s+/);
	    var stop_words_array = fs.readFileSync('../stop_words.txt').toString().replace(/[\W_]/g,' ').trim().split(/\s+/);
	    var stop_words = {};
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
    }
    
    var words = _extract_words(path_to_file);
    var doc_id;
    var word_id;
    
    db.serialize(function() {
        var stmt1 = db.prepare("INSERT INTO documents (name) VALUES (?)");
        stmt1.run(path_to_file);
        stmt1.finalize();    
      
        db.each("SELECT id FROM documents" ,function(err, row) {  
                                                doc_id = row.id;
                                            });  
      
        db.get("SELECT MAX(id) AS id FROM words", function(err, row) {
            db.serialize(function() {
                    word_id = row.id; 
                    if (word_id === null) {
                        word_id = 0;
                    }
                    db.run("BEGIN");
                    var stmt2 = db.prepare("INSERT INTO words VALUES (?, ?, ?)");
                    for (var w in words) {
                        stmt2.run(word_id, doc_id, words[w]);
                        word_id++;
                    }
                    stmt2.finalize();
                    db.run("COMMIT");
                    db.close();
                    });
        });
    });
}
  
// Create db if it doesn't exist
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var file = "tf.db";
var db = new sqlite3.Database(file);
fs.exists(file, function(exists) {
                        if(!exists){
                            create_db_schema();
                          load_file_into_database(process.argv[2]);
                        } 
                      });

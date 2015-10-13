// Author: Scott Vang
// Problem 25.1 and 25.2: Persistent Tables Style
// Database Query File

var sqlite3 = require('sqlite3').verbose();
var file = "tf.db";
var db = new sqlite3.Database(file);

db.all("SELECT value, Count(*) AS C FROM words GROUP BY value ORDER BY C DESC", function(err, rows) {
    for (var i in rows.slice(0,25)) {
        console.log(rows[i].value + "  -  " + rows[i].C);
    }
});

db.close();
var mysql2 = require('mysql2');

var con = mysql2.createConnection({
    host : "localhost",
    user : "debian-sys-maint",
    password : "CEMj8ptYHraxNxFt",
    database : "financial",
    charset : "utf8",
    multipleStatements : true
});

con.connect(function(err) {
    if (err) throw err;
});

module.exports = con
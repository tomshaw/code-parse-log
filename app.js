var fs = require('fs'),
    mysql = require("mysql");

var connection = mysql.createConnection({
    user: "root",
    password: "password",
    database: "project_belkinlog"
});

var formatDate = function (str) {
    var parts = str.split("/");
    return parts[2] + '-' + parts[0] + '-' + parts[1];
}

var selectData = function (cb) {
    connection.query('SELECT * FROM logs;', function (error, rows, fields) {
        console.log(rows);
        return cb();
    });
}

// Synchronous
/*var array = fs.readFileSync('error.log').toString().split("\n");
for (i in array) {
    var row = array[i],
        date = formatDate(row.substring(10, -10)),
        time = row.slice(12, 20),
        message = row.substring(21);
    var insert = {
        'logdate': date,
        'logtime': time,
        'message': message
    };
    connection.query('INSERT INTO logs SET ?', insert, function (err, result) {});
}*/

// Asynchronous:
var asynchronousStoreData = function (cb) {
    console.log('BEGIN INSERT');
    fs.readFile('error.log', function (err, data) {
        if (err) throw err;
        var split = data.toString().split("\n");
        for (i in split) {
            var row = split[i],
                date = formatDate(row.substring(10, -10)),
                time = row.slice(12, 20),
                message = row.substring(21);
            var array = {
                'logdate': date,
                'logtime': time,
                'message': message
            };
            if (date && time && message) {
                connection.query('INSERT INTO logs SET ?', array, function (err, result) {
                    if (err) throw err;
                });
            }
        }
        return cb();
    });
}

asynchronousStoreData(function () {
    selectData(function () {
        console.log('FINISHED INSERT');
        process.exit(code = 0);
    });
})
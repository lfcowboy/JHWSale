/**
 * Created by fenglv on 2015/8/5.
 */
var mysql = require('mysql');

function Pool(){

}

// create pool
exports.iniPool = function(){
    Pool.prototype.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'lvf05783154334',
        database:'jhwdrivermanagementsystem',
        port: 3306
    });
};

//select
exports.query = function(sql){
    Pool.prototype.pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql,function(err,rows){
            if (err) console.log(err);
            console.log("SELECT ==> ");
            for (var i in rows) {
                console.log(rows[i]);
            }
            conn.release();
        });
    });
};

Pool.prototype.pool.
//var conn = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'lvf05783154334',
//    database:'jhwdrivermanagementsystem',
//    port: 3306
//});
//conn.connect();
//conn.query('SELECT * from user limit 5', function(err, rows, fields) {
//    if (err) throw err;
//    console.log('The solution is: ', rows[3].NAME);
//    console.log(fields);
//});
//conn.end();
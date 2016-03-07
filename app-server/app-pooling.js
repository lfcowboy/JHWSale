/**
 * Created by fenglv on 2015/8/5.
 */
var mysql = require('mysql');

function Pool() {

}

// create pool
exports.iniPool = function () {
    Pool.prototype.pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'lvf05783154334',
        database: 'jhwsale',
        port: 3306
    });
};

//select
exports.query = function (sql, callback) {
    console.log("SELECT ==> " + sql);
    Pool.prototype.pool.getConnection(function (err, conn) {
        if (err) {
            console.log("POOL ==> " + err);
            callback(err, null, null);
        }
        else {
            conn.query(sql, function (qerr, rows, fields) {
                conn.release();
                if (qerr) {
                    console.log(qerr);
                    callback(qerr, null, null);
                }
                else {
                    for (var i in rows) {
                        console.log(rows[i]);
                    }
                    callback(qerr, rows, fields);
                }
            });
        }
    });
};

//insert
exports.insert = function (sql, callback) {
    console.log("INSERT == >" + sql);
    Pool.prototype.pool.getConnection(function (err, conn) {
        if (err) {
            console.log("POOL ==> " + err);
            callback(err, null);
        }
        else {
            conn.query(sql, function (ierr, res) {
                conn.release();
                if(ierr){
                    console.log(ierr);
                    callback(ierr, null);
                }else{
                    console.log(res);
                    callback(ierr, res);
                }
            });
        }
    });
}

exports.update = function(sql, callback) {
    Pool.prototype.pool.getConnection(function (err, conn) {
        if (err) {
            console.log("POOL ==> " + err);
            callback(err, null);
        }
        else {
            conn.query(sql, function (ierr, res) {
                conn.release();
                if(ierr){
                    callback(ierr, null);
                    console.log(ierr);
                }else{
                    console.log("UPDATE == >" + sql);
                    callback(ierr, res);
                }
            });
        }
    });
}
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
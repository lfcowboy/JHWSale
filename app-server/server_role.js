/**
 * Created by fenglv on 2016/1/5.
 */
var pool = require("./app-pooling");

exports.showSetRolePanel = function (req, res) {
    app.render('role/setRole', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getRoles = function (req, res){
    var sql = "select id, name from role";
    pool.query(sql, function (qerr, rows, fields) {
        res.json(rows);
    })
}
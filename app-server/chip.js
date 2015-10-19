/**
 * Created by fenglv on 2015/9/1.
 */
var pool = require("./app-pooling");
var customer = require("./customer");

exports.addChip = function (req, res) {
    var addSQL = 'insert into chip (code, package) values ("' + req.body.code + '","' + req.body.package + '")';
    pool.insert(addSQL, function (err1) {
        if (err1) {
            res.json({success: false, errorHead: '失败', errorMsg: '芯片新建失败！'});
        }
        else {
            res.json({success: true, confirmHead: '成功', confirmMsg: '芯片新建成功！'});
        }
    });
};

exports.getChip = function (req, res) {
    var querySQL = 'select * from chip';
    pool.query(querySQL,function(qerr, rows, fields){
        res.json(rows);
    });
};

exports.getChipByCode = function (req, res, callback) {
    var querySQL = 'select * from chip where code = "' + req.body.chipCode + '"';
    pool.query(querySQL,function(qerr, rows, fields){
        callback(qerr, rows, fields);
    });
};

exports.getPackage = function (req, res) {
    var querySQL = 'select * from conf_package';
    pool.query(querySQL,function(qerr, rows, fields){
        res.json(rows);
    });
};
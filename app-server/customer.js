/**
 * Created by fenglv on 2015/8/9.
 */
var pool = require("./app-pooling");

exports.addCompany = function (req, res) {
    var addSQL = 'insert into company (name) values ("' + req.body.name + '")';
    pool.insert(addSQL,function(err) {
        res.json({success:true, confirmHead:'成功', confirmMsg:'客户公司新建成功！'});
    });
};

exports.getCompany = function (req, res) {
    var querySQL = 'select * from company where name like "%' + req.body.companyName + '%"';
    pool.query(querySQL,function(qerr, rows, fields){
        res.json(rows);
    });
};

exports.getCompanyByName = function (req, res, callback) {
    var querySQL = 'select id from company where name = "' + req.body.companyName + '"';
    pool.query(querySQL,function(qerr, rows, fields){
        callback(qerr, rows, fields);
    });
};
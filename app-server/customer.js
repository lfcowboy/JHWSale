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
    var querySQL = 'select * from company where name like "%' + req.query.companyName + '%"';
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

exports.addCustomer = function (req, res) {
    exports.getCompanyByName(req, res, function (err, rows, fields) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '联系人新建失败！'});
        }
        else {
            if (rows.length === 0) {
                res.json({success: false, errorHead: '失败', errorMsg: '请输入正确的公司！'});
            }
            else {
                var companyId = rows[0].id;
                var addSQL = 'insert into customer (name, companyId) values ("' + req.body.name + '","' + companyId + '")';
                pool.insert(addSQL,function(err) {
                    res.json({success:true, confirmHead:'成功', confirmMsg:'联系人新建成功！'});
                });
            }
        }
    });
};

exports.getCustomerByCompanyId = function(req, res){
    var querySQL = 'select id, name from customer where companyId = "' + req.body.companyId + '"';
    pool.query(querySQL,function(qerr, rows, fields){
        res.json(rows);
    });
};

exports.getCustomerByCustomerId = function(customerId, callback){
    var querySQL = 'select id, name, jobTitle, tel, email from customer where id = "' + customerId + '"';
    pool.query(querySQL,function(qerr, rows, fields){
        callback(rows[0]);
    });
}
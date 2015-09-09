/**
 * Created by fenglv on 2015/9/1.
 */
var pool = require("./app-pooling");
var customer = require("./customer");

exports.addProduct = function (req, res) {
    customer.getCompanyByName(req, res, function (err, rows, fields) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '产品新建失败！'});
        }
        else {
            if (rows.length === 0) {
                res.json({success: false, errorHead: '失败', errorMsg: '请输入正确的客户公司！'});
            }
            else {
                var companyId = rows[0].id;
                var addSQL = 'insert into product (code, companyId) values ("' + req.body.code + '","' + companyId + '")';
                pool.insert(addSQL,function(err1) {
                    if(err1){
                        res.json({success: false, errorHead: '失败', errorMsg: '产品新建失败！'});
                    }else{
                        res.json({success:true, confirmHead:'成功', confirmMsg:'产品新建成功！'});
                    }
                });
            }
        }
    });
};

exports.getProduct = function (req, res) {
    var querySQL = 'select code from product';
    pool.query(querySQL,function(qerr, rows, fields){
        res.json(rows);
    });
};

exports.getProductByCode = function (req, res, callback) {
    var querySQL = 'select * from product where code = "' + req.body.productCode + '"';
    pool.query(querySQL,function(qerr, rows, fields){
        callback(qerr, rows, fields);
    });
};
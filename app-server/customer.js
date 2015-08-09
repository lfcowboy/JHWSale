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
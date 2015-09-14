/**
 * Created by fenglv on 2015/8/9.
 */
 var pool = require("./app-pooling");
 var customer = require("./customer");
 var product = require("./product");

 exports.addQuote = function (req, res) {
    customer.getCompanyByName(req, res, function (err, rows, fields) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '报价单新建失败！'});
        }
        else {
            if (rows.length === 0) {
                res.json({success: false, errorHead: '失败', errorMsg: '请输入正确的客户公司！'});
            }
            else {
                var companyId = rows[0].id;
                var addSQL = 'insert into quote (customerId, quoteNum, companyId, currency) values ("1","' + req.body.quoteNum + '","' + companyId + '","' + req.body.currency + '")';
                pool.insert(addSQL, function (err) {
                    if (err) {
                        res.json({success: false, errorHead: '失败', errorMsg: '报价单新建失败！'});
                    }
                    else {
                        app.render('quote/addPrice', {'quoteId':'周芸丽1'}, function(err, html) {
                            res.json({success: true, confirmHead: '成功', confirmMsg: '报价单新建成功！', htmlContent: html});
                        });
                    }
                });
            }
        }
    });
};

exports.addPrice = function (req, res) {
    product.getProductByCode(req, res, function (err, rows, fields) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '报价新建失败！'});
        }
        else {
            if (rows.length === 0) {
                res.json({success: false, errorHead: '失败', errorMsg: '请选择正确的产品型号！'});
            }
            else {
                var productId = rows[0].id;
                var addSQL = 'insert into price (productId) values (' + productId + ')';
                pool.insert(addSQL, function (err) {
                    if (err) {
                        res.json({success: false, errorHead: '失败', errorMsg: '报价新建失败！'});
                    }
                    else {
                        res.json({success: true, confirmHead: '成功', confirmMsg: '报价新建成功1！'});
                    }
                });
            }
        }
    });
};

exports.getPrice = function (req, res) {
    var querySQL = 'select * from price';
    pool.query(querySQL, function (qerr, rows, fields) {
        res.json(rows);
    })
};

exports.getNewQuoteNum = function (req, res) {
    var currDate = (new Date()).Format('YYYYMMDD');
    var quoteNumPrefix = 'SDICBJ' + currDate;
    //var querySQL = 'select count(*) as quoteSum from quote where quoteNum like "' + quoteNumPrefix + '%"';
    var querySQL = 'select max(quoteNum) as newQuoteNum from quote where quoteNum like "' + quoteNumPrefix + '%"';
    pool.query(querySQL, function (qerr, rows, fields) {
        if (rows[0].newQuoteNum !== null) {
            var newQuoteNum = parseInt(rows[0].newQuoteNum.substr(14)) + 1;
            if (newQuoteNum <= 9) {
                newQuoteNum = "0" + newQuoteNum;
            }
            newQuoteNum = quoteNumPrefix + newQuoteNum;
        }
        else {
            var newQuoteNum = quoteNumPrefix + "01";
        }
        res.json({success: true, newQuoteNum: newQuoteNum});
    })
}

exports.getDefaultRemarks = function(req, res){
    var querySQL = 'select id, name from conf_remark';
    pool.query(querySQL,function(qerr, rows, fields){
        res.json(rows);
    });
}

Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() >= 9 ? this.getMonth().toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}
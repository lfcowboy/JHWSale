/**
 * Created by fenglv on 2015/8/9.
 */
var pool = require("./app-pooling");
var customer = require("./customer");
var chip = require("./chip");
var constants = require("./server_constants");

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
                var addSQL = 'insert into quote (customerId, quoteNum, companyId, currency, remark, reporterId, reportDate, sectionId) ' +
                    'values ("' + req.body.customerId + '","' + req.body.quoteNum + '","' + companyId + '","' + req.body.currency + '",' +
                    '"' + req.body.remark + '","' + req.session.user.id + '",curdate(),"' + req.body.sectionId + '")';
                pool.insert(addSQL, function (err, result) {
                    if (err) {
                        res.json({success: false, errorHead: '失败', errorMsg: '报价单新建失败！'});
                    }
                    else {
                        res.json({success: true, msg: '报价单新建成功！', quoteId: result.insertId});
                    }
                });
            }
        }
    });
};

exports.updateQuote = function (req, res) {
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
                var addQuoteSQL = 'update quote set customerId = "' + req.body.customerId + '", currency = "' + req.body.currency + '", ' +
                    'companyId = "' + companyId + '", remark = "' + req.body.remark + '", sectionId = "' + req.body.sectionId + '" ' +
                    'where id = "' + req.body.id + '"';
                pool.insert(addQuoteSQL, function (addErr, result) {
                    res.json({success: true, msg: '报价单变更成功！', quoteId: req.body.id});
                });
            }
        }
    });
}

exports.addPrice = function (req, res) {
    var addSQL = 'insert into price (chipId,quoteId,min,max,price,tax,privateRemark,publicRemark) ' +
        'values (' + req.body.chipId + ',' + req.body.quoteId + ',' + req.body.min + ',' + req.body.max + ',' + req.body.price + ',' +
        req.body.tax + ',"' + req.body.privateRemark + '","' + req.body.publicRemark + '")';
    pool.insert(addSQL, function (err, result) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '报价新建失败！'});
        }
        else {
            //var querySQL = 'select LAST_INSERT_ID() as id';
            //pool.query(querySQL, function (qerr, rows, fields) {
            res.json({success: true, id: result.insertId, msg: '报价新建成功！'});
            //});
        }
    });
};

exports.updatePrice = function (req, res) {
    var updateSQL = "update price set chipId = '" + req.body.chipId + "', min = '" + req.body.min + "', " +
        "max = '" + req.body.max + "', price = '" + req.body.price + "', tax = '" + req.body.tax + "', " +
        "privateRemark = '" + req.body.privateRemark + "', publicRemark = '" + req.body.publicRemark + "' where id = '" + req.body.id + "'";
    pool.update(updateSQL, function (err) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '报价编辑失败！'});
        }
        else {
            res.json({success: true, id: req.body.id, msg: '报价编辑成功！'});
        }
    });
};

exports.deletePrice = function (req, res) {
    var deleteSQL = "delete from price where id = '" + req.body.id + "'";
    pool.query(deleteSQL, function (err) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '报价删除失败！'});
        }
        else {
            res.json({success: true, msg: '报价删除成功！'});
        }
    });
}

exports.deleteQuote = function (req, res) {
    var deleteSQL = "delete from quote where id = '" + req.body.id + "'";
    pool.query(deleteSQL, function (err) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '报价单删除失败！'});
        }
        else {
            deleteSQL = "delete from price where quoteId = '" + req.body.id + "'";
            pool.query(deleteSQL, function (err) {
                if (err) {
                    res.json({success: false, errorHead: '失败', errorMsg: '报价单删除失败！'});
                }
                else {
                    res.json({success: true, msg: '报价单删除成功！'});
                }
            });
        }
    });
}

var queryPriceSQL = 'select price.id as id, price.chipId as chipId, chip.code as chipCode, quote.quoteNum as quoteNum, ' +
    'price.min as min, price.max as max, price.price as price, price.tax as tax, price.privateRemark as privateRemark, ' +
    'price.publicRemark as publicRemark, quote.remark as remark, company.name as companyName, customer.name as customerName, ' +
    'user.name as reporter, date_format(quote.reportDate,"%Y-%m-%d") as reportDate from price, quote, chip, company, customer, user ' +
    'where price.quoteId = quote.id and price.chipId = chip.id and quote.companyId = company.id and quote.customerId = customer.id and quote.reporterId = user.id';

exports.getPrice = function (req, res) {
    pool.query(queryPriceSQL, function (qerr, rows, fields) {
        res.json(rows);
    })
};

exports.getQuote = function (req, res) {
    var queryQuoteSQL = 'select quote.id as id, quote.quoteNum as quoteNum, quote.remark as remark, company.name as companyName, company.id as companyId, customer.id as customerId, customer.name as customerName, ' +
        'user.name as reporter, date_format(quote.reportDate,"%Y-%m-%d") as reportDate, quote.sectionId as sectionId from quote, company, customer, user ' +
        'where quote.companyId = company.id and quote.customerId = customer.id and quote.reporterId = user.id';
    if(req.query.reporterId){
        queryQuoteSQL += ' and quote.reporterId = "' + req.query.reporterId + '"';
    }
    pool.query(queryQuoteSQL, function (qerr, rows, fields) {
        res.json(rows);
    })
};

exports.getPriceByQuoteId = function (req, res){
    var querySQL = queryPriceSQL + ' and quote.id = ' + req.query.quoteId;
    pool.query(querySQL, function (qerr, rows, fields) {
        res.json(rows);
    })
}

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

exports.getDefaultRemarks = function (req, res) {
    var querySQL = 'select id, name from conf_remark';
    pool.query(querySQL, function (qerr, rows, fields) {
        res.json(rows);
    });
}

exports.showAddQuotePanel = function (req, res) {
    var data = {'quote': new Object()};
    if (req.query.quoteId) {
        var getQuoteSQL = 'select * from quote where id = "' + req.query.quoteId + '"';
        pool.query(getQuoteSQL, function (qerr, quote) {
            data.quote = quote[0];
            app.render('quote/addQuote', data, function (rerr, html) {
                res.json({success: true, htmlContent: html});
            });
        });
    }else{
        app.render('quote/addQuote', data, function (rerr, html) {
            res.json({success: true, htmlContent: html});
        });
    }
}

exports.showQuoteListPanel = function (req, res) {
    app.render('quote/quoteList', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showMyQuoteListPanel = function (req, res) {
    app.render('quote/quoteList', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showPriceListReportPanel = function (req, res) {
    app.render('quote/priceList', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showEditPriceListPanel = function (req, res) {
    var param = {quoteId: req.query.quoteId};
    app.render('quote/addPrice', param, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showPrintQuotePanel = function (req, res){
    customer.getCustomerByCustomerId(req.body.customerId,function(customerInfo){
        req.body.customerJobTitle = customerInfo.jobTitle;
        req.body.customerTel = customerInfo.tel;
        req.body.customerEmail = customerInfo.email;
        var querySQL = 'select price.chipId as chipId, chip.code as chipCode, '+
            'price.min as min, price.max as max, price.price as price, price.tax as tax ' +
            'from price, chip where price.quoteId =' + req.body.id + ' and price.chipId = chip.id';
        pool.query(querySQL, function (qerr, rows, fields) {
            req.body.prices = rows;
            app.render('quote/printQuote', req.body, function (err, html){
                res.json({success: true, htmlContent: html});
            });
        })
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
/**
 * Created by fenglv on 2015/8/9.
 */
var pool = require("./app-pooling");

exports.addQuote = function (req, res) {
    var addSQL = 'insert into quote (customerId, quoteNum, currency) values ("1","' + req.body.quoteNum + '","' + req.body.currency + '")';
    pool.insert(addSQL,function(err) {
        res.json({success:true, confirmHead:'成功', confirmMsg:'报价单新建成功！'});
    });
};

exports.getNewQuoteNum = function (req, res) {
    var currDate = (new Date()).Format('YYYYMMDD');
    var quoteNumPrefix = 'SDICBJ' + currDate;
    //var querySQL = 'select count(*) as quoteSum from quote where quoteNum like "' + quoteNumPrefix + '%"';
    var querySQL = 'select max(quoteNum) as newQuoteNum from quote where quoteNum like "' + quoteNumPrefix + '%"';
    pool.query(querySQL,function(qerr, rows, fields){
        if(rows[0].newQuoteNum !== null){
            var newQuoteNum = parseInt(rows[0].newQuoteNum.substr(14)) + 1;
            if(newQuoteNum <= 9){
                newQuoteNum = "0" + newQuoteNum;
            }
            newQuoteNum = quoteNumPrefix + newQuoteNum;
        }else{
            var newQuoteNum = quoteNumPrefix + "01";
        }
        res.json({success:true, newQuoteNum:newQuoteNum});
    })
}

Date.prototype.Format = function(formatStr)
{
    var str = formatStr;
    var Week = ['日','一','二','三','四','五','六'];

    str=str.replace(/yyyy|YYYY/,this.getFullYear());
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

    str=str.replace(/MM/,this.getMonth()>=9?this.getMonth().toString():'0' + (this.getMonth() + 1));
    str=str.replace(/M/g,this.getMonth());

    str=str.replace(/w|W/g,Week[this.getDay()]);

    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
    str=str.replace(/d|D/g,this.getDate());

    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
    str=str.replace(/h|H/g,this.getHours());
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
    str=str.replace(/m/g,this.getMinutes());

    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
    str=str.replace(/s|S/g,this.getSeconds());

    return str;
}
/**
 * Created by fenglv on 2015/7/28.
 */
var pool = require("./app-pooling");
exports.loadLogin = function (req, res) {
    //res.render('index',{'userName':'周芸丽1'}, function(err, html) {
    //    console.log(html);
    //    //res.json({success: true, confirmHead: '成功', confirmMsg: '报价新建成功1！', htmlContent: html});
    //    res.send(html);
    //});
    res.render('login',{'userName':'未登录'});
};
exports.doLogin = function(req, res){
    var selectSQL = 'select * from user where account = "' + req.body.username + '"';
    pool.query(selectSQL,function(err,rows,fields) {
        console.log("username:" + req.body.username);
        //if(req.body.username===user.username && req.body.password===user.password){
            req.session.user=rows[0];
            res.redirect("/");
            //res.render('index',{'userName':req.session.user.username});
        //} else {
        //    res.render('index',{'userName':'未登录'});
        //}
    });
};

exports.doLogout = function(req, res){
    console.log(req.session.user);
    req.session.user = null;
    res.redirect("/");
};

exports.getUser = function(req, res){
    var selectSQL = 'select id, name, account from user';
    pool.query(selectSQL,function(err,rows,fields){
        res.json(rows);
    });
}
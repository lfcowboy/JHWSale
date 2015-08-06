/**
 * Created by fenglv on 2015/7/28.
 */
var path = require('path');
var pool = require("../app-server/app-pooling");
exports.login = function (req, res) {
    res.render('index',{'userName':'周芸丽'});
};
exports.doLogin = function(req, res){

    var selectSQL = 'select * from user where account = "' + req.body.username + '"';
    pool.query(selectSQL,function(err,rows,fields) {
        console.log("username:" + req.body.username);
        //if(req.body.username===user.username && req.body.password===user.password){
            req.session.user=user;
            res.redirect("/");
            //res.render('index',{'userName':req.session.user.username});
        //} else {
        //    res.render('index',{'userName':'未登录'});
        //}
        //for (var i in rows) {
        //    console.log(rows[i]);
        //}
    });
};
/**
 * Created by fenglv on 2015/7/28.
 */
var path = require('path');
exports.login = function (req, res) {
    res.render('index',{'userName':'周芸丽'});
};
exports.doLogin = function(req, res){
    var user={
        username:'1',
        password:'1'
    }
    console.log("username:" + req.body.username);
    if(req.body.username===user.username && req.body.password===user.password){
        req.session.user=user;
        res.render('index',{'userName':req.session.user.username});
    } else {
        res.render('index',{'userName':'未登录'});
    }
};
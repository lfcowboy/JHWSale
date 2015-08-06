/**
 * Created by fenglv on 2015/7/19.
 */
var path = require('path');
exports.index = function (req, res) {
    if(req.session.user){
        res.render('index',{'userName':req.session.user.NAME});
    }else{
        res.render('index',{'userName':'未登录'});
    }
};
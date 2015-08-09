/**
 * Created by fenglv on 2015/7/19.
 */
exports.index = function (req, res) {
    if(req.session.user){
        res.render('index',{'userName':req.session.user.name});
    }else{
        res.render('index',{'userName':'未登录'});
    }
};
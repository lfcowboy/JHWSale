/**
 * Created by fenglv on 2015/7/19.
 */
exports.loginFilter = function (req, res, next) {
    if(req.session.user){
        next();
        //res.render('index',{'userName':req.session.user.name});
    }else{
        res.render('login');
    }
};

exports.index = function (req, res, next) {
    res.render('index',{'userName':req.session.user.name});
};
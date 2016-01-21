/**
 * Created by fenglv on 2015/7/19.
 */
var role = require('./server_role');

exports.loginFilter = function (req, res, next) {
    if(req.session.user){
        next();
        //res.render('index',{'userName':req.session.user.name});
    }else{
        res.render('login');
    }
};

exports.index = function (req, res, next) {
    var result = {'user':req.session.user};
    role.getUserActions(req.session.user.id, function(qerr, rows, fields){
        var actions = {};
        rows.forEach(function(action){
            actions[action.value] = action;
        });
        result.actions = actions;
        res.render('index',result);
    });
};
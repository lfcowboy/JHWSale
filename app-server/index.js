/**
 * Created by fenglv on 2015/7/19.
 */
var section = require('./server_group');

exports.loginFilter = function (req, res, next) {
    if(req.session.user){
        next();
        //res.render('index',{'userName':req.session.user.name});
    }else{
        res.render('login');
    }
};

exports.index = function (req, res, next) {
    var result = {'userName':req.session.user.name};
    var actions = {'setSectionUser': true, 'setSectionRoleUser': true};
    result.actions = actions;
    section.getSections(function(sections){
        result.sections = sections;
        res.render('index',result);
    });
};
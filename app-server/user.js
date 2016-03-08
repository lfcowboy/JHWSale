/**
 * Created by fenglv on 2015/7/28.
 */
var pool = require("./app-pooling");
var sectionSever = require('./server_group');

exports.loadLogin = function (req, res) {
    //res.render('index',{'userName':'周芸丽1'}, function(err, html) {
    //    console.log(html);
    //    //res.json({success: true, confirmHead: '成功', confirmMsg: '报价新建成功1！', htmlContent: html});
    //    res.send(html);
    //});
    res.render('login', {'userName': '未登录'});
};
exports.doLogin = function (req, res) {
    var selectSQL = 'select * from user where account = "' + req.body.username + '"';
    pool.query(selectSQL, function (err, rows, fields) {
        console.log("username:" + req.body.username);
        //if(req.body.username===user.username && req.body.password===user.password){
        req.session.user = rows[0];
        res.redirect("/");
        //res.render('index',{'userName':req.session.user.username});
        //} else {
        //    res.render('index',{'userName':'未登录'});
        //}
    });
};

exports.doLogout = function (req, res) {
    console.log(req.session.user);
    req.session.user = null;
    res.redirect("/");
};

exports.getUsers = function (req, res) {
    var selectSQL = 'select id, name, account from user';
    pool.query(selectSQL, function (err, rows, fields) {
        res.json(rows);
    });
}

exports.addUser = function (req, res) {
    var addUserSQL = 'insert into user (name,account,password) values("' + req.body.name + '","' + req.body.account + '","' + req.body.password + '")';
    pool.insert(addUserSQL, function (err, result) {
        var addDefaultSectionSQL = 'insert into section_user(sectionId,userId) values ("0","' + result.insertId + '")';
        pool.insert(addDefaultSectionSQL, function (err) {
            res.json({success: true, confirmHead: '成功', confirmMsg: '帐号新建成功！'});
        });
    });
}

exports.getUserActionSection = function (req, res){
    console.log("==== getUserActionSection ====> ");
    var selectSQL = 'select distinct depart.id as id, depart.name as name from role_action, section_user_role, depart ' +
        'where role_action.actionId = "' + req.query.actionId + '" and section_user_role.userId = "' + req.session.user.id + '" ' +
        'and role_action.roleId = section_user_role.roleId and depart.id = section_user_role.sectionId;';
    pool.query(selectSQL, function (err, rows, fields) {
        res.json(rows);
    })
}
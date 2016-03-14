/**
 * Created by fenglv on 2015/7/28.
 */
var pool = require("./app-pooling");
var sectionSever = require('./server_group');

exports.loadLogin = function (req, res) {
    res.render('login', {'msg': ''});
};
exports.doLogin = function (req, res) {
    var selectSQL = 'select * from user where account = "' + req.body.username + '"';
    pool.query(selectSQL, function (err, rows, fields) {
        if(rows.length === 1 ){
            var user = rows[0];
            if(req.body.username == user.account && req.body.password == user.password) {
                req.session.user = user;
                res.redirect('/');
                return;
            }
        }
        var data = {'msg': '用户名或密码错误，请重新输入!'};
        res.render('login', data);
    });
};

exports.doLogout = function (req, res) {
    console.log(req.session.user);
    req.session.user = null;
    res.redirect("/");
};

exports.showAddUserDialog = function (req, res) {
    var data = {user: new Object()};
    app.render('user/addUser', data, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showEditUserDialog = function (req, res) {
    var data = {user: req.session.user};
    app.render('user/addUser', data, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getUsers = function (req, res) {
    var selectSQL = 'select id, name, account from user';
    pool.query(selectSQL, function (err, rows, fields) {
        res.json(rows);
    });
}

exports.getUserById = function (id, callback){
    var selectSQL = 'select id, name, account from user where id = ' + id;
    pool.query(selectSQL, function (err, rows, fields) {
        callback(rows);
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

exports.updateUser = function (req, res) {
    var updateUserSQL = 'update user set name = "' + req.body.name + '" where id = "' + req.session.user.id + '"';
    pool.insert(updateUserSQL, function(uerr, result){
        console.log(req.session.user.id);
        exports.getUserById(req.session.user.id, function(user){
            req.session.user = user[0];
            res.json({success: true, msg: '用户信息变更成功！'});
        });
    })
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
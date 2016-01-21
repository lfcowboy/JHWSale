/**
 * Created by fenglv on 2016/1/5.
 */
var pool = require("./app-pooling");

exports.showSetRolePanel = function (req, res) {
    app.render('role/setRole', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getRoles = function (req, res){
    var sql = "select id, name from role";
    pool.query(sql, function (qerr, rows, fields) {
        res.json(rows);
    })
}

exports.getActions = function (req, res){
    var sql = "select id, name, value from conf_action";
    pool.query(sql, function (qerr, rows, fields) {
        res.json(rows);
    })
}

exports.getUserActions = function(userId, callback){
    var sql = 'select conf_action.id as id, conf_action.name as name, conf_action.value as value ' +
        'from section_user_role, role_action, conf_action ' +
        'where section_user_role.userId = "' + userId + '" and section_user_role.roleId = role_action.roleId and role_action.actionId = conf_action.id; '
    pool.query(sql, callback);
}

exports.addRole = function (req, res) {
    var addRoleSQL = 'insert into role (name) values("' + req.body.name + '")';
    pool.insert(addRoleSQL, function (err, result) {
        var addRoleActionSQL = 'insert into role_action (roleId,actionId) values ';
        var actions = JSON.parse(req.body.actions);
        actions.forEach(function(id){
            addRoleActionSQL += '("' + result.insertId + '","' + id + '"),';
        });
        pool.insert(addRoleActionSQL.substring(0,addRoleActionSQL.length-1), function (roleActionErr) {
            res.json({success: true, confirmHead: '成功', confirmMsg: '角色新建成功！'});
        });
    });
}
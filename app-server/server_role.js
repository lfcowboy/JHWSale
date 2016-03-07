/**
 * Created by fenglv on 2016/1/5.
 */
var pool = require("./app-pooling");

exports.showRoleListPanel = function (req, res) {
    app.render('role/roleList', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showRoleActionsPanel = function (req, res) {
    var sql = 'select conf_action.id as id, conf_action.name as name, conf_action.value as value from role_action, conf_action where role_action.roleId = "' + req.query.roleId + '" and role_action.actionId = conf_action.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {'roleActions': rows};
        app.render('role/roleActionsPanel', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetRolePanel = function (req, res) {
    app.render('role/setRole', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showAddRoleDialog = function (req, res) {
    var data = {'roleId': req.query.roleId, 'roleName': req.query.roleName};
    app.render('role/addRole', data, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getRoles = function (req, res){
    var sql = "select id, name, setBySys from role";
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

exports.getAllActionsByRoleId = function (req, res){
    var sql = "select conf_action.id as id, conf_action.name as name, conf_action.value as value, role_action.roleId as roleId " +
        "from conf_action left join role_action on role_action.roleId= '" + req.query.roleId + "' and role_action.actionId = conf_action.id";
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

exports.updateRole = function (req, res) {
    var addRoleSQL = 'update role set name = "' + req.body.name + '" where id = "' + req.body.id + '"';
    pool.insert(addRoleSQL, function (err, result) {
        var deleteRoleActionSql = 'delete from role_action where roleId = "' + req.body.id + '"';
        pool.query(deleteRoleActionSql, function (deleteErr) {
            var addRoleActionSQL = 'insert into role_action (roleId,actionId) values ';
            var actions = JSON.parse(req.body.actions);
            actions.forEach(function(id){
                addRoleActionSQL += '("' + req.body.id + '","' + id + '"),';
            });
            pool.insert(addRoleActionSQL.substring(0,addRoleActionSQL.length-1), function (roleActionErr) {
                res.json({success: true, confirmHead: '成功', confirmMsg: '角色变更成功！'});
            });
        });
    });
}
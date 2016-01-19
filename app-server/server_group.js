/**
 * Created by fenglv on 2016/1/9.
 */
var pool = require("./app-pooling");

exports.showSetGroupPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('group/setGroup', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetSectionUserPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('group/setSectionUser', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetSectionRoleUserPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('group/setSectionRoleUser', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.addDepart = function (req, res) {
    var addSQL = 'insert into depart (name) values("' + req.body.name + '")';
    pool.insert(addSQL, function (err) {
        res.json({success: true, confirmHead: '成功', confirmMsg: '部门新建成功！'});
    });
}

exports.getSections = function (callback) {
    var sql = "select id, name from depart";
    pool.query(sql, function (qerr, rows, fields) {
        callback(rows);
    })
}

exports.getSectionUsers = function (req, res) {
    var selectSQL = 'select user.id as id, user.name as name, user.account as account from section_user,user where section_user.sectionId = "' + req.query.sectionId + '" and section_user.userId = user.id';
    pool.query(selectSQL, function (err, rows, fields) {
        res.json(rows);
    });
}

exports.getSectionRoleUsersDiv = function (req, res) {
    var selectSQL = 'select user.id as id, user.name as name, user.account as account from section_user_role,user ' +
        'where section_user_role.sectionId = "' + req.query.sectionId + '" and section_user_role.roleId = "' + req.query.roleId + '" and section_user_role.userId = user.id';
    pool.query(selectSQL, function (err, rows, fields) {
        var data = {"users": rows, "sectionId": req.query.sectionId, "roleId": req.query.roleId}
        app.render('group/sectionRoleUserDiv', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.addSectionRoleUser = function (req, res){
    var selectSQL = 'select * from section_user_role where sectionId = "' + req.body.sectionId + '" and roleId = "' + req.body.roleId + '" and userId = "' + req.body.userId + '"';
    pool.query(selectSQL, function(err, rows, fields){
        if (rows.length !== 0) {
            res.json({success: false, errorHead: '失败', errorMsg: '用户已有此权限！'});
        }else{
            var addSQL = 'insert into section_user_role(sectionId,userId,roleId) values ("' + req.body.sectionId + '","' + req.body.userId + '","' + req.body.roleId + '")';
            pool.insert(addSQL, function (err) {
                res.json({success: true, confirmHead: '成功', confirmMsg: '授权成功！'});
            });
        }
    });
}

exports.deleteSectionRoleUser = function (req, res) {
    var deleteSQL = 'delete from section_user_role where sectionId = "' + req.body.sectionId + '" and roleId = "' + req.body.roleId + '" and userId = "' + req.body.userId + '"';
    pool.query(deleteSQL, function (err) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '授权取消失败！'});
        }
        else {
            res.json({success: true, msg: '授权取消成功！'});
        }
    });
}

exports.addSectionUser = function(req, res){
    var selectSQL = 'select * from section_user where sectionId = "' + req.body.sectionId + '" and userId = "' + req.body.userId + '"';
    pool.query(selectSQL, function(err, rows, fields){
        if (rows.length !== 0) {
            res.json({success: false, errorHead: '失败', errorMsg: '用户已在该部门！'});
        }else{
            var addSQL = 'insert into section_user(sectionId,userId) values ("' + req.body.sectionId + '","' + req.body.userId + '")';
            pool.insert(addSQL, function (err) {
                res.json({success: true, confirmHead: '成功', confirmMsg: '组员添加成功！'});
            });
        }
    });
}

exports.deleteSectionUser = function (req, res) {
    var deleteRoleSQL = 'delete from section_user_role where sectionId = "' + req.body.sectionId + '" and userId = "' + req.body.userId + '"';
    pool.query(deleteRoleSQL, function (err) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '组员移除失败！'});
        }
        else {
            var deleteUserSQL = 'delete from section_user where sectionId = "' + req.body.sectionId + '" and userId = "' + req.body.userId + '"';
            pool.query(deleteUserSQL, function (err) {
                if (err) {
                    res.json({success: false, errorHead: '失败', errorMsg: '组员移除失败！'});
                }
                else {
                    res.json({success: true, msg: '组员移除成功！'});
                }
            });
        }
    });
}
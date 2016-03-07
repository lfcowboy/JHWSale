/**
 * Created by fenglv on 2016/1/9.
 */
var pool = require("./app-pooling");

exports.showSetGroupPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('section/setGroup', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetSectionUserPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('section/setSectionUser', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetSectionRolePanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('section/setSectionRole', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetSectionRoleUserPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('section/setSectionRoleUser', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.addDepart = function (req, res) {
    var addSQL = 'insert into depart (name, owner) values("' + req.body.name + '","' + req.body.owner + '")';
    pool.insert(addSQL, function (err, result) {
        var addSectionAdminRole = 'insert into section_role (roleId, sectionId) values("1", "' + result.insertId + '")';
        pool.insert(addSectionAdminRole, function (roleErr) {
            var addSectionUser = 'insert into section_user (userId, sectionId) values("' + req.body.owner + '","' + result.insertId + '")';
            pool.insert(addSectionUser, function (userErr) {
                var addSectionRoleUser = 'insert into section_user_role (sectionId, roleId, userId) values("' + result.insertId + '","1","' + req.body.owner + '")';
                pool.insert(addSectionRoleUser, function (roleUserErr) {
                    res.json({success: true, confirmHead: '成功', confirmMsg: '部门新建成功！'});
                });
            });
        });
    });
}

exports.showSectionListPanel = function (req, res) {
    app.render('section/sectionList', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getSections = function (req, res) {
    var sql = "select depart.id as id, depart.name as name, user.name as owner from depart, user where depart.owner = user.id";
    pool.query(sql, function (qerr, rows, fields) {
        res.json(rows);
    })
}

exports.getSectionUsers = function (req, res) {
    var selectSQL = 'select user.id as id, user.name as name, user.account as account from section_user,user where section_user.sectionId = "' + req.query.sectionId + '" and section_user.userId = user.id';
    pool.query(selectSQL, function (err, rows, fields) {
        res.json(rows);
    });
}

exports.getSectionRoleUsersDiv = function (req, res) {
    var getSectionOwnerSQL = 'select owner as sectionOwner from depart where id = "' + req.query.sectionId + '"';
    console.log(getSectionOwnerSQL);
    pool.query(getSectionOwnerSQL, function (ownerErr, ownerRows, ownerFields) {
        var sectionOwner = ownerRows[0].sectionOwner;
        var selectSQL = 'select user.id as id, user.name as name, user.account as account from section_user_role,user ' +
            'where section_user_role.sectionId = "' + req.query.sectionId + '" and section_user_role.roleId = "' + req.query.roleId + '" and section_user_role.userId = user.id';
        pool.query(selectSQL, function (err, rows, fields) {
            var data = {"users": rows, "sectionId": req.query.sectionId, "roleId": req.query.roleId, "sectionOwner": sectionOwner};
            app.render('section/sectionRoleUserDiv', data, function (err, html) {
                res.json({success: true, htmlContent: html});
            });
        });
    });
}

exports.getSectionRoleDiv = function (req, res) {
    var selectSQL = 'select role.id as id, role.name as name, role.setBySys from section_role,role ' +
        'where section_role.sectionId = "' + req.query.sectionId + '" and section_role.roleId = role.id';
    pool.query(selectSQL, function (err, rows, fields) {
        var data = {"roles": rows, "sectionId": req.query.sectionId}
        app.render('section/sectionRoleDiv', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.getSectionRolesDiv = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.query.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.query.sectionId};
        app.render('section/sectionRolesDiv', data, function (err, html) {
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

exports.deleteSectionRole = function (req, res) {
    var deleteSQL = 'delete from section_role where sectionId = "' + req.body.sectionId + '" and roleId = "' + req.body.roleId + '"';
    pool.query(deleteSQL, function (err) {
        if (err) {
            res.json({success: false, errorHead: '失败', errorMsg: '角色删除失败！'});
        }
        else {
            res.json({success: true, msg: '角色删除成功！'});
        }
    });
}

exports.addSectionUser = function(req, res){
    var selectSQL = 'select * from section_user where sectionId = "' + req.body.sectionId + '" and userId = "' + req.body.userId + '" limit 1';
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

exports.addSectionRole = function(req, res){
    var selectSQL = 'select id from section_role where sectionId = "' + req.body.sectionId + '" and roleId = "' + req.body.roleId + '" limit 1';
    pool.query(selectSQL, function(err, rows, fields){
        if (rows.length !== 0) {
            res.json({success: false, errorHead: '失败', errorMsg: '角色已在该部门！'});
        }else{
            var addSQL = 'insert into section_role(sectionId,roleId) values ("' + req.body.sectionId + '","' + req.body.roleId + '")';
            pool.insert(addSQL, function (err) {
                res.json({success: true, confirmHead: '成功', confirmMsg: '角色添加成功！'});
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
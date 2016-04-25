/**
 * Created by fenglv on 2016/1/9.
 */
var pool = require("./app-pooling");
var constants = require('./server_constants');

exports.showSetGroupPanel = function (req, res) {
    var sql = 'select role.id as id, role.name as name from section_role, role where section_role.sectionId = "' + req.body.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.body.sectionId};
        app.render('section/setGroup', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.showSetSectionFramePanel = function (req, res) {
    var data = {"panelName": req.query.panelName};
    app.render('section/setSectionFrame', data, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getSetSectionUserDiv = function (req, res) {
    var data = {"sectionId": req.body.sectionId};
    app.render('section/setSectionUser', data, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.getSetSectionRoleDiv = function (req, res) {
    var data = {"sectionId": req.query.sectionId};
    app.render('section/setSectionRole', data, function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.addSection = function (req, res) {
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

exports.updateSection = function (req, res) {
    var sectionId = req.body.sectionId;
    var sectionName = req.body.name;
    var ownerId = req.body.owner;
    getSectionById(sectionId, function (sections) {
        if (sections[0].ownerId != ownerId) {
            removeSectionOwner(sectionId, function () {
                updateSection(sectionId, sectionName, ownerId, function () {
                    res.json({success: true, confirmHead: '成功', confirmMsg: '部门编辑成功！'});
                });
            });
        } else {
            updateSection(sectionId, sectionName, ownerId, function () {
                res.json({success: true, confirmHead: '成功', confirmMsg: '部门编辑成功！'});
            });
        }
    });
}

exports.showSectionListPanel = function (req, res) {
    app.render('section/sectionList', function (err, html) {
        res.json({success: true, htmlContent: html});
    });
}

exports.showAddSectionDialog = function (req, res) {
    var sectionId = req.query.sectionId;
    var data = {'section': new Object()};
    if (sectionId !== undefined && sectionId !== null) {
        getSectionById(req.query.sectionId, function (section) {
            data.section = section[0];
            app.render('section/addSection', data, function (err, html) {
                res.json({success: true, htmlContent: html});
            });
        })
    } else {
        app.render('section/addSection', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    }
}

exports.getSections = function (req, res) {
    var sql = "select depart.id as id, depart.name as name, user.name as owner from depart left join user on depart.owner = user.id";
    pool.query(sql, function (qerr, rows, fields) {
        res.json(rows);
    })
}

exports.getSectionUsers = function (req, res) {
    var selectSQL = 'select user.id as id, user.name as name, user.account as account, user.tel as tel, user.email as email ' +
        'from section_user,user where section_user.sectionId = ' + req.query.sectionId + ' and section_user.userId = user.id';
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

exports.getSectionRoleUserDiv = function (req, res) {
    var sql = 'select role.id as id, role.name as name, role.setBySys as setBySys from section_role, role where section_role.sectionId = "' + req.query.sectionId + '" and section_role.roleId = role.id';
    pool.query(sql, function (qerr, rows, fields) {
        var data = {"sectionRoles": rows, "sectionId": req.query.sectionId};
        app.render('section/setSectionRoleUser', data, function (err, html) {
            res.json({success: true, htmlContent: html});
        });
    });
}

exports.addSectionRoleUser = function (req, res) {
    var selectSQL = 'select * from section_user_role where sectionId = "' + req.body.sectionId + '" and roleId = "' + req.body.roleId + '" and userId = "' + req.body.userId + '"';
    pool.query(selectSQL, function (err, rows, fields) {
        if (rows.length !== 0) {
            res.json({success: false, errorHead: '失败', errorMsg: '用户已有此权限！'});
        } else {
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

exports.addSectionUser = function (req, res) {
    var sectionId = req.body.sectionId;
    var userId = req.body.userId;
    isInSection(sectionId, userId, function (exist) {
        if (exist) {
            res.json({success: false, errorHead: '失败', errorMsg: '用户已在该部门！'});
        } else {
            addSectionUser(sectionId, userId, function () {
                res.json({success: true, confirmHead: '成功', confirmMsg: '组员添加成功！'});
            })
        }
    })
}

exports.addSectionRole = function (req, res) {
    var selectSQL = 'select id from section_role where sectionId = "' + req.body.sectionId + '" and roleId = "' + req.body.roleId + '" limit 1';
    pool.query(selectSQL, function (err, rows, fields) {
        if (rows.length !== 0) {
            res.json({success: false, errorHead: '失败', errorMsg: '角色已在该部门！'});
        } else {
            var addSQL = 'insert into section_role(sectionId,roleId) values ("' + req.body.sectionId + '","' + req.body.roleId + '")';
            pool.insert(addSQL, function (err) {
                res.json({success: true, confirmHead: '成功', confirmMsg: '角色添加成功！'});
            });
        }
    });
}

exports.deleteSectionUser = function (req, res) {
    var sectionId = req.body.sectionId;
    var userId = req.body.userId;
    removeSectionUser(sectionId, userId, function () {
        res.json({success: true, msg: '组员移除成功！'});
    })
}

var isInSection = function (sectionId, userId, callback) {
    var selectSQL = 'select * from section_user where sectionId = "' + sectionId + '" and userId = "' + userId + '" limit 1';
    pool.query(selectSQL, function (err, rows, fields) {
        callback(rows.length !== 0);
    });
}

var addSectionUser = function (sectionId, userId, callback) {
    var addUserSQL = 'insert into section_user(sectionId,userId) values (' + sectionId + ',' + userId + ')';
    pool.insert(addUserSQL, callback);
}

var removeSectionUser = function (sectionId, userId, callback) {
    isSectionOwner(sectionId, userId, function (isOwner) {
        if (isOwner) {
            removeSectionOwner(sectionId, function () {
                removeSectionUserRole(sectionId, userId, function () {
                    var deleteUserSQL = 'delete from section_user where sectionId = "' + sectionId + '" and userId = "' + userId + '"';
                    pool.query(deleteUserSQL, callback);
                });
            })
        } else {
            removeSectionUserRole(sectionId, userId, function () {
                var deleteUserSQL = 'delete from section_user where sectionId = "' + sectionId + '" and userId = "' + userId + '"';
                pool.query(deleteUserSQL, callback);
            });
        }
    })
}

var getSectionById = function (sectionId, callback) {
    var sql = "select depart.id as id, depart.name as name, user.id as ownerId, user.name as ownerName from depart left join user on depart.owner = user.id where depart.id = " + sectionId + "";
    pool.query(sql, function (qerr, rows, fields) {
        callback(rows);
    })
}

var updateSection = function (sectionId, sectionName, ownerId, callback) {
    var updateSectionSQL = 'update depart set name = "' + sectionName + '", owner = ' + ownerId + ' where id = ' + sectionId;
    pool.update(updateSectionSQL, function (err, result) {
        setSectionOwner(sectionId, ownerId, callback);
    });
}

var setSectionOwner = function (sectionId, userId, callback) {
    isInSection(sectionId, userId, function (exist) {
        if (!exist) {
            addSectionUser(sectionId, userId, function () {
                setUserRole(sectionId, userId, constants.ROLE_SECTION_OWNER_ID, callback);
            });
        } else {
            setUserRole(sectionId, userId, constants.ROLE_SECTION_OWNER_ID, callback);
        }
    });
}

var setUserRole = function (sectionId, userId, roleId, callback) {
    var addSectionRoleUser = 'insert into section_user_role (sectionId, roleId, userId) values(' + sectionId + ',' + roleId + ',' + userId + ')';
    pool.insert(addSectionRoleUser, callback);
}

var removeSectionOwner = function (sectionId, callback) {
    var deleteUserRole = 'delete from section_user_role where sectionId = ' + sectionId + ' and roleId = ' + constants.ROLE_SECTION_OWNER_ID;
    pool.update(deleteUserRole, function () {
        var emptySectionOwnerSQL = 'update depart set owner = null where id = ' + sectionId;
        pool.update(emptySectionOwnerSQL, callback);
    });
}

var removeSectionUserRole = function (sectionId, userId, callback) {
    var deleteUserRoleSQL = 'delete from section_user_role where sectionId = "' + sectionId + '" and userId = "' + userId + '"';
    pool.update(deleteUserRoleSQL, callback);
}

var isSectionOwner = function (sectionId, userId, callback) {
    var selectSQL = 'select * from section_user_role where sectionId = ' + sectionId + ' and userId = ' + userId + ' and roleId = ' + constants.ROLE_SECTION_OWNER_ID + ' limit 1';
    pool.query(selectSQL, function (err, rows, fields) {
        callback(rows.length !== 0);
    });
}
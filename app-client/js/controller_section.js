/**
 * Created by fenglv on 2016/1/5.
 */
var initSetSectionUserPanel = function (actionId) {
    initSectionList(actionId);
    $("#setSectionUser_section").on('select', function (event) {
        if (event.args) {
            var item = event.args.item;
            if (item) {
                initUserListTable(item.value);
            }
        }
    });
}

var initSetSectionRolePanel = function (actionId) {
    initSectionList(actionId);
    $("#setSectionUser_section").on('select', function (event) {
        if (event.args) {
            var item = event.args.item;
            if (item) {
                showSectionRole(item.value);
            }
        }
    });

    $('#setSectionRole_sectionRoleSearch').click(function () {
        var paras = {'sectionId': $("#setSectionUser_section").jqxDropDownList('getSelectedItem').value};

        function addSectionRole(roleId) {
            var params = {
                sectionId: $('#setSectionUser_section').jqxDropDownList('getSelectedItem').value,
                roleId: roleId
            };
            $.ajax({
                data: params,
                url: '/addSectionRole',
                type: 'post',
                dataType: 'json',
                cache: false,
                timeout: 5000,
                success: function (data) {
                    if (data.success) {
                        showSuccess(data.confirmMsg);
                        showSectionRole(params.sectionId);
                    } else {
                        showError(data.errorMsg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showErrorMsgDefault();
                }
            });
        }

        searchDropdown('setSectionRole_sectionRoleList', 'setSectionRole_sectionRoleName', paras, '/getRoles', addSectionRole);
    });
}

var initSetSectionRoleUserPanel = function (actionId) {
    initSectionList(actionId);

    $("#setSectionUser_section").on('select', function (event) {
        if (event.args) {
            var item = event.args.item;
            if (item) {
                showSectionRoles(item.value);
            }
        }
    });
}

var showSectionRole = function (sectionId) {
    var params = {'sectionId': sectionId};
    $.ajax({
        data: params,
        url: '/getSectionRoleDiv',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $("#setSectionRole_sectionRoleDiv").html(data.htmlContent);
                $("a[name='removeSectionRole']").click(function () {
                    var deletePara = {
                        "roleId": $(this).data("roleId"),
                        "sectionId": $(this).data("sectionId")
                    }
                    $.ajax({
                        data: deletePara,
                        url: '/deleteSectionRole',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        timeout: 5000,
                        success: function (data) {
                            if (data.success) {
                                showSuccess(data.msg);
                            }
                            else {
                                showErrorMsg(data.errorHead, data.errorMsg);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            showErrorMsgDefault();
                        }
                    });
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorMsgDefault();
        }
    });
}

var initUserListTable = function (sectionId) {
    var data = {
        "sectionId": sectionId
    };
    var source =
    {
        data: data,
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'account', type: 'string'},
            {name: 'name', type: 'string'}
        ],
        url: '/getSectionUsers',
        deleterow: function (rowid, commit) {
            var deleteData = {
                "userId": $('#userListTable').jqxGrid('getrowdata', rowid).id,
                "sectionId": data.sectionId
            };
            $.ajax({
                data: deleteData,
                url: '/deleteSectionUser',
                type: 'post',
                dataType: 'json',
                cache: false,
                timeout: 5000,
                success: function (data) {
                    if (data.success) {
                        showSuccess(data.msg);
                        commit(true);
                    }
                    else {
                        showErrorMsg(data.errorHead, data.errorMsg);
                        commit(false);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showErrorMsgDefault();
                    commit(false);
                }
            });
        }
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '帐号',
            datafield: 'account',
            filtertype: 'input',
            width: '50%'
        },
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '50%'
        }
    ];

    var initrowdetails = function (index, parentElement, gridElement, datarecord) {
        $(parentElement).append(rowDetailTemp);
    }

    // initialize jqxGrid
    $('#userListTable').jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            selectionmode: 'singlerow',
            pageable: true,
            autoheight: true,
            filterable: true,
            showfilterrow: true,
            altRows: true,
            columns: columns,
            scrollBarSize: 8,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                var me = this;
                var container = $("<div class='btn-group' style='margin: 5px;'></div>");
                toolbar.append(container);
                container.append('<button id="deleterowbutton" class="btn btn-small">删除</button>');
                $("#deleterowbutton").jqxButton();
                // delete row.
                $("#deleterowbutton").on('click', function () {
                    var selectedrowindex = $("#userListTable").jqxGrid('getselectedrowindex');
                    var rowscount = $("#userListTable").jqxGrid('getdatainformation').rowscount;
                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                        var id = $("#userListTable").jqxGrid('getrowid', selectedrowindex);
                        var commit = $("#userListTable").jqxGrid('deleterow', id);
                    }
                });
            }
        });
    $('#userListTable').jqxGrid({rowsheight: 28});

    $('#setSectionUser_sectionUserSearch').click(function () {
        var paras = {'sectionId': $("#setSectionUser_section").jqxDropDownList('getSelectedItem').value};

        function addSectionUser(userId) {
            var params = {
                sectionId: $('#setSectionUser_section').jqxDropDownList('getSelectedItem').value,
                userId: userId
            };
            $.ajax({
                data: params,
                url: '/addSectionUser',
                type: 'post',
                dataType: 'json',
                cache: false,
                timeout: 5000,
                success: function (data) {
                    if (data.success) {
                        showSuccess(data.confirmMsg);
                        $('#userListTable').jqxGrid('source').dataBind();
                    } else {
                        showError(data.errorMsg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showErrorMsgDefault();
                }
            });
        }

        searchDropdown('setGroup_userList1', 'setGroup_userName1', paras, '/getUsers', addSectionUser);
    });
}

var showSectionRoles = function (sectionId) {
    var params = {'sectionId': sectionId};
    $.ajax({
        data: params,
        url: '/getSectionRolesDiv',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $("#setSectionRoleUser_sectionRolesDiv").html(data.htmlContent);
                $("button[name='showSectionRoleUserButton']").click(function () {
                    var roleId = $(this).data("roleId");
                    if ($("#sectionRoleUserDiv" + roleId).is(":visible")) {
                        $("#sectionRoleUserDiv" + roleId).slideToggle(1000);
                        return;
                    } else {
                        showSectionRoleUserDiv(sectionId, roleId, function () {
                            $("#sectionRoleUserDiv" + roleId).slideToggle(1000);
                        });
                    }
                });

                $("a[name='setGroup_userSearch']").click(function () {
                    var paras = {sectionId: $(this).data("sectionId")};
                    var roleId = $(this).data('roleId');
                    function addSectionRoleUser(userId) {
                        var params = {
                            sectionId: $(this).data('sectionId'),
                            roleId: $(this).data('roleId'),
                            userId: userId
                        };
                        $.ajax({
                            data: params,
                            url: '/addSectionRoleUser',
                            type: 'post',
                            dataType: 'json',
                            cache: false,
                            timeout: 5000,
                            success: function (data) {
                                if (data.success) {
                                    showSuccess(data.confirmMsg);
                                    if ($('#sectionRoleUserDiv').is(':visible')) {
                                        showSectionRoleUserDiv(function () {
                                        });
                                    }
                                } else {
                                    showError(data.errorMsg);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                showErrorMsgDefault();
                            }
                        });
                    }
                    searchDropdown('setGroup_userList' + roleId, 'setGroup_userName' + roleId, paras, '/getSectionUsers', addSectionRoleUser);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorMsgDefault();
        }
    });
}

var showSectionRoleUserDiv = function (sectionId, roleId, callback) {
    var params = {
        sectionId: sectionId,
        roleId: roleId
    };
    $.ajax({
        data: params,
        url: '/getSectionRoleUsersDiv',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $("#sectionRoleUserDiv" + roleId).html(data.htmlContent);
                $("a[name='removeUserRole']").click(function () {
                    var deletePara = {
                        "userId": $(this).data("userId"),
                        "roleId": $(this).data("roleId"),
                        "sectionId": $(this).data("sectionId")
                    }
                    $.ajax({
                        data: deletePara,
                        url: '/deleteSectionRoleUser',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        timeout: 5000,
                        success: function (data) {
                            if (data.success) {
                                showSuccess(data.msg);
                            }
                            else {
                                showErrorMsg(data.errorHead, data.errorMsg);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            showErrorMsgDefault();
                        }
                    });
                });
                callback();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorMsgDefault();
        }
    });
}

var showNewSectionDialog =  function(){
    $('#addSection_ownerSearch').click(function () {
        var params = {"ownerName": $('#addSection_ownerName').val()};
        searchDropdown('addSection_ownerList', 'addSection_ownerName', params, '/getUsers', function (userId) {
            $('#addSection_ownerId').val(userId);
        });
    });

    $("#addGroupButton").click(function () {
        var params = {
            name: $('#addGroup_name').val(),
            owner: $('#addSection_ownerId').val()
        };
        $.ajax({
            data: params,
            url: '/addGroup',
            type: 'post',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    showConfirmMsg(data.confirmHead, data.confirmMsg);
                    $('#addGroupDialog').modal('hide');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showErrorMsgDefault();
            }
        });
    });
}

$("#addAccountButton").click(function () {
    var params = {
        account: $('#addAccount_account').val(),
        name: $('#addAccount_name').val(),
        password: $('#addAccount_password').val()
    };
    $.ajax({
        data: params,
        url: '/addUser',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                showConfirmMsg(data.confirmHead, data.confirmMsg);
                $('#addAccountDialog').modal('hide');
                //dataAdapter.dataBind();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorMsgDefault();
        }
    });
});


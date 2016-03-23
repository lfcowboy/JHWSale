/**
 * Created by fenglv on 2016/1/5.
 */
var initSectionListPanel = function () {
    initSectionListTable();
}

var initSectionListTable = function () {
    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'},
            {name: 'owner', type: 'string'}
        ],
        url: '/getSections'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '50%'
        },
        {
            text: '管理员',
            datafield: 'owner',
            filtertype: 'input',
            width: '50%'
        }
    ];

    // initialize jqxGrid
    $('#sectionListTable').jqxGrid(
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
            scrollBarSize: 8
        });
    $('#sectionListTable').jqxGrid({rowsheight: 28});
}

var initSetSectionUserPanel = function (actionId) {
    initSectionList(actionId);
    $("#commonDropdown_userActionSection").on('select', function (event) {
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
    $("#commonDropdown_userActionSection").on('select', function (event) {
        if (event.args) {
            var item = event.args.item;
            if (item) {
                showSectionRole(item.value);
            }
        }
    });

    $('#setSectionRole_sectionRoleSearch').click(function () {
        var paras = {'sectionId': $("#commonDropdown_userActionSection").jqxDropDownList('getSelectedItem').value};

        function addSectionRole(roleId) {
            var params = {
                sectionId: $('#commonDropdown_userActionSection').jqxDropDownList('getSelectedItem').value,
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

    $("#commonDropdown_userActionSection").on('select', function (event) {
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
            {name: 'name', type: 'string'},
            {name: 'tel', type: 'string'},
            {name: 'email', type: 'string'}
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
            width: '25%'
        },
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '25%'
        },
        {
            text: '电话',
            datafield: 'tel',
            filtertype: 'input',
            width: '25%'
        },
        {
            text: '电邮',
            datafield: 'email',
            filtertype: 'input',
            width: '25%'
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
        var paras = {'sectionId': $("#commonDropdown_userActionSection").jqxDropDownList('getSelectedItem').value};

        function addSectionUser(userId) {
            var params = {
                sectionId: $('#commonDropdown_userActionSection').jqxDropDownList('getSelectedItem').value,
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
                    var roleId = $(this).data('roleId');
                    var sectionId = $(this).data("sectionId");
                    var paras = {sectionId: sectionId, roleId: roleId};
                    function addSectionRoleUser(userId, otherParams) {;
                        var params = {
                            sectionId: otherParams.sectionId,
                            roleId: otherParams.roleId,
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
                                    if ($('#sectionRoleUserDiv' + roleId).is(':visible')) {
                                        showSectionRoleUserDiv(sectionId, roleId, function () {
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
    var mandatoryValidation = function () {
        var addSectionButton = $('#addSectionButton');
        addSectionButton.prop('disabled', false);
        mandatoryIconControl($('#addSection_name'), addSectionButton);
    }
    mandatoryValidation();
    $( '#addSection_name').on( 'keyup change', function( e ) {
        mandatoryValidation();
    } );

    $('#addSection_ownerSearch').click(function () {
        var params = {"ownerName": $('#addSection_ownerName').val()};
        searchDropdown('addSection_ownerList', 'addSection_ownerName', params, '/getUsers', function (userId) {
            $('#addSection_ownerId').val(userId);
        });
    });

    $("#addSectionButton").click(function () {
        var params = {
            name: $('#addSection_name').val(),
            owner: $('#addSection_ownerId').val()
        };
        $.ajax({
            data: params,
            url: '/addSection',
            type: 'post',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    showConfirmMsg(data.confirmHead, data.confirmMsg);
                    $('#addSectionDialog').modal('hide');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showErrorMsgDefault();
            }
        });
    });
}


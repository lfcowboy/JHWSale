/**
 * Created by fenglv on 2016/1/5.
 */
var initUserListTable = function (data) {
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
            var deleteData ={"userId": $('#userListTable').jqxGrid('getrowdata', rowid).id, "sectionId": data.sectionId};
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
                    dataAdapter.dataBind();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showErrorMsgDefault();
            }
        });
    });

    $('#setGroup_userSearch1').click(function () {
        var paras = {sectionId: $(this).data("sectionId")};

        function addSectionUser(userId) {
            var params = {
                sectionId: $('#setGroup_userSearch1').data('sectionId'),
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


$("#addGroupButton").click(function () {
    var params = {
        name: $('#addGroup_name').val()
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

function showSectionRoleUserDiv(callback) {
    var params = {
        sectionId: $(this).data("sectionId"),
        roleId: $(this).data("roleId")
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
                $("#sectionRoleUserDiv").html(data.htmlContent);
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

var initSectionRoleUserPanel = function () {
    $("button[name='showSectionRoleUserButton']").click(function () {
        if ($("#sectionRoleUserDiv").is(":visible")) {
            $("#sectionRoleUserDiv").slideToggle(1000);
            return;
        } else {
            showSectionRoleUserDiv(function () {
                $("#sectionRoleUserDiv").slideToggle(1000);
            });
        }
    });

    $('#setGroup_userSearch').click(function () {
        var paras = {sectionId: $(this).data("sectionId")};

        function addSectionRoleUser(userId) {
            var params = {
                sectionId: $('#setGroup_userSearch').data('sectionId'),
                roleId: $('#setGroup_userSearch').data('roleId'),
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

        searchDropdown('setGroup_userList', 'setGroup_userName', paras, '/getSectionUsers', addSectionRoleUser);
    });
}
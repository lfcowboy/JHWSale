/**
 * Created by fenglv on 2016/1/5.
 */
var initRoleListPanel = function () {
    $("#splitter").jqxSplitter({width: '100%', height: 500, panels: [{size: '40%'}]});
    initRoleListTable();
}

var initRoleListTable = function () {
    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'},
            {name: 'setBySys', type: 'string'}
        ],
        url: '/getRoles'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '40%'
        },
        {
            text: '系统设置',
            datafield: 'setBySys',
            filtertype: 'input',
            columntype: 'checkbox',
            width: '40%'
        }, {
            text: '变更', datafield: 'Edit', columntype: 'button', width: '20%', cellsrenderer: function () {
                return "变更";
            }, buttonclick: function (row) {
                var dataRecord = $("#roleListTable").jqxGrid('getrowdata', row);
                var data = {"roleId":dataRecord.id, "roleName": dataRecord.name};
                $(".content-panel").hide();
                showContentPanel('showPanel_addRole', data, function(){
                    initAddRoleDialog(dataRecord.id);
                    $('#addRoleDialog').modal('show');
                });
            }
        }
    ];

    // initialize jqxGrid
    $('#roleListTable').jqxGrid(
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
    $('#roleListTable').jqxGrid({rowsheight: 28});

    $('#roleListTable').on('rowselect', function (event) {
        // event arguments.
        var args = event.args;
        // selected row.
        var row = event.args.row;
        // update inputs.
        var params = {
            "roleId": row.id
        };
        $.ajax({
            data: params,
            url: '/showPanel_roleActions',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    $("#roleActionsPanel").html(data.htmlContent);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showErrorMsgDefault();
            }
        });
    });
}

var initAddRoleDialog = function(roleId) {
    var param = {"roleId": roleId};
    var getActionsUrl = '/getActions';
    if (roleId != null) {
        getActionsUrl = '/getAllActionsByRoleId';
    }
    var actionSource =
    {
        data: param,
        datatype: "json",
        async: false,
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'},
            {name: 'roleId', type: 'string'}
        ],
        url: getActionsUrl
    };
    var actionDataAdapter = new $.jqx.dataAdapter(actionSource);
    $("#addRole_actionList").jqxListBox({
        source: actionDataAdapter,
        displayMember: "name",
        valueMember: "id",
        checkboxes: true
    });
    if (roleId != null) {
        var actions = actionDataAdapter.records;
        actions.forEach(function (action, index) {
            if (action.roleId == roleId) {
                var item = $("#addRole_actionList").jqxListBox('getItemByValue', action.id);
                $("#addRole_actionList").jqxListBox('checkItem', item);
            }
        });
    }

    $("#saveRoleButton").click(function () {
        var actions = [];
        $("#addRole_actionList").jqxListBox('getCheckedItems').forEach(function (action, index) {
            actions.push(action.value);
        });
        var url = '/addRole';
        if(roleId != null){
            url = '/updateRole';
        }
        var params = {
            "id": roleId,
            "name": $('#addRole_name').val(),
            "actions": JSON.stringify(actions)
        };
        $.ajax({
            data: params,
            url: url,
            type: 'post',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    showConfirmMsg(data.confirmHead, data.confirmMsg);
                    $('#addRoleDialog').modal('hide');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showErrorMsgDefault();
            }
        });
    });
}
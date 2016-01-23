/**
 * Created by fenglv on 2016/1/5.
 */
var actionSource =
{
    datatype: "json",
    datafields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
    ],
    url: '/getActions'
};

var actionDataAdapter = new $.jqx.dataAdapter(actionSource);
$("#addRole_actionList").jqxListBox({
    width: '100%',
    source: actionDataAdapter,
    displayMember: "name",
    valueMember: "id",
    checkboxes: true,
    height: '100%'
});

$("#addRoleButton").click(function () {
    var actions = [];
    $("#addRole_actionList").jqxListBox('getCheckedItems').forEach(function (action, index) {
        actions.push(action.value);
    });
    var params = {
        "name": $('#addRole_name').val(),
        "actions": JSON.stringify(actions)
    };
    $.ajax({
        data: params,
        url: '/addRole',
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
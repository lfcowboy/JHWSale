/**
 * Created by fenglv on 2015/8/31.
 */

$('#addChipDialog').on('show.bs.modal', function () {
    initPackageList();
});

var initPackageList = function () {
    $.ajax({
        url: '/getPackage',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            initList('addChip_package', 'addChip_packageList', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

$("#addChipButton").click(function(){
    var params ={
        companyName: $('#addChip_companyName').val(),
        code: $("#addChip_code").val(),
        package: $("#addChip_package").selectlist('selectedItem').value
    };
    $.ajax({
        data: params,
        url: '/addChip',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $('#addChipDialog').modal('hide');
            }else{
                showErrorMsgDefault();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});
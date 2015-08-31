/**
 * Created by fenglv on 2015/8/31.
 */
$('#addProduct_companySearch').click(function(){
    searchDropdown('addProduct_companyList', 'addProduct_companyName',function(){});
});

$("#addProductButton").click(function(){
    var params ={
        companyName: $('#addProduct_companyName').val(),
        code: $("#addProduct_code").val()
    };
    $.ajax({
        data: params,
        url: '/addProduct',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $('#addProductDialog').modal('hide');
            }else{
                showErrorMsgDefault();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});
/**
 * Created by fenglv on 2015/8/9.
 */
 $("#addCompanyButton").click(function(){
    var params ={
        name: $("#addCompany_name").val()
    };
    $.ajax({
        data: params,
        url: '/addCompany',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $("#addCompanyPanel").hide();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});

 $("#addCustomerButton").click(function(){
    var params ={
        companyName: $('#addCustomer_companyName').val(),
        name: $("#addCustomer_name").val()
    };
    $.ajax({
        data: params,
        url: '/addCustomer',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $('#addCustomerDialog').modal('hide');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});

 $('#addCustomer_companySearch').click(function(){
    searchDropdown('addCustomer_companyList', 'addCustomer_companyName');
});

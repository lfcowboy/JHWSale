/**
 * Created by fenglv on 2015/8/9.
 */
$("#addQuoteButton").click(function(){
    var params ={
        quoteNum: $("#addQuote_quoteNum").val(),
        companyName: $("#addQuote_companyName").val(),
        currency: $('input[name="currency"]:checked').val()
    };
    $.ajax({
        data: params,
        url: '/addQuote',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $("#addQuotePanel").hide();
            }else{
                showErrorMsg(data.errorHead,data.errorMsg);
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});

var initAddQuote  = function init(){
    $.ajax({
        url: '/getNewQuoteNum',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                $('#addQuote_quoteNum').val(data.newQuoteNum);
                //showConfirmMsg(data.confirmHead,data.confirmMsg);
                //$("#addQuotePanel").hide();
            }
            //var data = $.parseJSON(data);
            //alert(data.message);
        },
        error: function(jqXHR, textStatus, errorThrown){
            //alert("报价单创建失败，请重试或者联系管理员!");
            //alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

$('#addQuote_companySearch').click(function(){
    searchDropdown('addQuote_companyList', 'addQuote_companyName',function(companyId){
        initCustomerList(companyId);
    });
});

var initCustomerList = function(companyId){
    var params = {
        companyId: companyId
    };
    $.ajax({
        data: params,
        url: '/getCustomer',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            initList('addQuote_customer','addQuote_customerList',data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var clearCompany =  function(){
    clearSelect('addQuote_companyName');
    clearList('addQuote_customer','addQuote_customerList');
};
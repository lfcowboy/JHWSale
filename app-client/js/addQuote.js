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
    $('#addQuote_companyList').empty();
    var params ={
        companyName: $("#addQuote_companyName").val()
    };
    $.ajax({
        data: params,
        url: '/getCompany',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            var lis = '';
            for (var i in data) {
                lis = lis + '<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:selectCompany(\'' + data[i].name + '\')"><span>' + data[i].name +'</span></a></li>';
            }
            $('#addQuote_companyList').append(lis);
        },
        error: function(jqXHR, textStatus, errorThrown){
        }
    });
})

var selectCompany = function(companyName){
    $("#addQuote_companyName").val(companyName);
};
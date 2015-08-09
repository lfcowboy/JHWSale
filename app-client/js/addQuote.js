/**
 * Created by fenglv on 2015/8/9.
 */
$("#addQuoteButton").click(function(){
    var params ={
        quoteNum: $("#addQuote_quoteNum").val(),
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
            }
            //var data = $.parseJSON(data);
           //alert(data.message);
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert("报价单创建失败，请重试或者联系管理员!");
            //alert('error ' + textStatus + " " + errorThrown);
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
/**
 * Created by fenglv on 2015/8/8.
 */
$("#addQuoteMenu").click(function(){
    $(".content-panel").hide();
    initAddQuote();
    $("#addQuotePanel").show();
});

$("#quoteManagementMenu").click(function(){
    $(".content-panel").hide();
    $("#quoteManagementPanel").show();
});

$("#addCompanyMenu").click(function(){
    $(".content-panel").hide();
    $("#addCompanyPanel").show();
});
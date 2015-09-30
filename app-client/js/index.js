/**
 * Created by fenglv on 2015/8/8.
 */
$("#addQuoteMenu").click(function(){
    $(".content-panel").hide();
    initAddQuote();
    $("#addQuotePanel").show();
});

$("#quoteListMenu").click(function(){
    $(".content-panel").hide();
    showPriceListTable();
});

$("#priceListMenu").click(function(){
    $(".content-panel").hide();
    showPriceListTable();
});

$("#addCompanyMenu").click(function(){
    $(".content-panel").hide();
    $("#addCompanyPanel").show();
});
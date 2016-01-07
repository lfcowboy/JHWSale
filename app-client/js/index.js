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
    showQuoteListPanel();
});

$("#priceListMenu").click(function(){
    $(".content-panel").hide();
    showPriceListPanel();
});

$("#addCompanyMenu").click(function(){
    $(".content-panel").hide();
    $("#addCompanyPanel").show();
});

$("#setRoleMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_SetRole', function(){
        initUserListTable();
    });
});
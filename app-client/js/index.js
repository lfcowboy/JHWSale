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

$("li[name='setGroupMenu']").click(function(){
    $(".content-panel").hide();
    var data = {"sectionId": $(this).data("sectionId")};
    showContentPanel('showPanel_setGroup', data, function(){
        initUserListTable(data);
    });
});

//$("li[name='setSectionUserMenu']").click(function(){
//    $(".content-panel").hide();
//    var data = {"sectionId": $(this).data("sectionId")};
//    showContentPanel('showPanel_setSectionUser', data, function(){
//        initUserListTable(data);
//    });
//});

$("#setSectionUserMenu").click(function(){
    $(".content-panel").hide();
    var data = {"actionId": $(this).data("actionId")};
    showContentPanel('showPanel_setSectionUser', data, function(){
        initSectionList(data);
    });
});

$("li[name='setSectionRoleUserMenu']").click(function(){
    $(".content-panel").hide();
    var data = {"sectionId": $(this).data("sectionId")};
    showContentPanel('showPanel_setSectionRoleUser', data, function(){
        initSectionRoleUserPanel();
    });
});

$("#setRoleMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_setRole', function(){
    });
});
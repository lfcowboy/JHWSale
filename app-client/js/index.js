/**
 * Created by fenglv on 2015/8/8.
 */
$("#myQuoteNewMenu").click(function(){
    $(".content-panel").hide();
    var actionId = $(this).data("actionId");
    showContentPanel('showPanel_addQuote', null, function(){
        initAddQuote(actionId);
    });
});

$("#myQuoteListQueryMenu").click(function(){
    $(".content-panel").hide();
    var userId = $(this).data("userId");
    var param = {'reporterId': userId};
    showContentPanel('showPanel_myQuoteList', null, function(){
        initMyQuoteListQueryPanel(param);
    });
});

$("#myQuoteListEditMenu").click(function(){
    $(".content-panel").hide();
    var userId = $(this).data("userId");
    var actionId = $(this).data("actionId");
    var param = {'reporterId': userId, 'actionId': actionId};
    showContentPanel('showPanel_myQuoteList', null, function(){
        initMyQuoteListEditPanel(param);
    });
});

$("#myQuoteListDeleteMenu").click(function(){
    $(".content-panel").hide();
    var userId = $(this).data("userId");
    var param = {'reporterId': userId};
    showContentPanel('showPanel_myQuoteList', null, function(){
        initMyQuoteListDeletePanel(param);
    });
});

$("#myQuoteListPrintMenu").click(function(){
    $(".content-panel").hide();
    var userId = $(this).data("userId");
    var param = {'reporterId': userId};
    showContentPanel('showPanel_myQuoteList', null, function(){
        initMyQuoteListPrintPanel(param);
    });
});

$("#quoteListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_myQuoteList', null, function(){
        initQuoteListTable(null);
    });
});

$("#priceListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_priceListReport', null, function(){
        initPriceListTable();
    });
});

$("#addCompanyMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_addCompany', null, function(){
        initAddCompanyPanel();
    });
});

$("#addCustomerMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_addCustomer', null, function(){
        initAddCustomerPanel();
    });
});

$("#addSectionMenu").click(function(){
    editSectionMenuClick();
});

var editSectionMenuClick = function(sectionId){
    $(".content-panel").hide();
    var data = {"sectionId":sectionId};
    showContentPanel('showPanel_addSection', data, function(){
        showNewSectionDialog();
        $('#addSectionDialog').modal('show');
    });
}

$("#userListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_userList', null, function(){
        initUserListPanel();
    });
});

$("#sectionListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_sectionList', null, function(){
        initSectionListPanel();
    });
});

$("#companyListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_companyList', null, function(){
        initCompanyListPanel();
    });
});

$("#customerListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_customerList', null, function(){
        initCustomerListPanel();
    });
});

$("#roleListMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_roleList', null, function(){
        initRoleListPanel();
    });
});
//$("li[name='setGroupMenu']").click(function(){
//    $(".content-panel").hide();
//    var data = {"sectionId": $(this).data("sectionId")};
//    showContentPanel('showPanel_setGroup', data, function(){
//        initUserListTable(data);
//    });
//});

//$("li[name='setSectionUserMenu']").click(function(){
//    $(".content-panel").hide();
//    var data = {"sectionId": $(this).data("sectionId")};
//    showContentPanel('showPanel_setSectionUser', data, function(){
//        initUserListTable(data);
//    });
//});

$("#setSectionUserMenu").click(function(){
    $(".content-panel").hide();
    var actionId = $(this).data("actionId");
    var data = {"actionId": actionId, "panelName": "部门组员"};
    showContentPanel('showPanel_setSectionFrame', data, function(){
        showSetSectionFrame(actionId,showSetSectionUserDiv);
    });
});

$("#setSectionRoleMenu").click(function(){
    $(".content-panel").hide();
    var actionId = $(this).data("actionId");
    var data = {"actionId": actionId, "panelName": "部门角色"};
    showContentPanel('showPanel_setSectionFrame', data, function(){
        showSetSectionFrame(actionId,showSetSectionRoleDiv);
    });
});

$("#setSectionRoleUserMenu").click(function(){
    $(".content-panel").hide();
    var actionId = $(this).data("actionId");
    var data = {"actionId": actionId};
    showContentPanel('showPanel_setSectionFrame', data, function(){
        showSetSectionFrame(actionId,showSectionRoles);
    });
});

$("#editRoleMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_addRole', null, function(){
        initAddRoleDialog(null);
        $('#addRoleDialog').modal('show');
    });
});

$("#addUserMenu").click(function(){
    $(".content-panel").hide();
    showContentPanel('showPanel_addUser', null, function(){
        initAddUserDialog();
        $('#addUserDialog').modal('show');
    });
});

$("#editUserMenu").click(function(){
    $(".content-panel").hide();
    var param = {'userId': $(this).data("userId")};
    showContentPanel('showPanel_editUser', param, function(){
        initAddUserDialog(param);
        $('#addUserDialog').modal('show');
    });
});
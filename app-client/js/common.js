/**
 * Search
 */
var searchDropdown = function (searchList, searchField, params, url, callback) {
    $('#' + searchList).empty();
    $.ajax({
        data: params,
        url: url,
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            var lis = '';
            for (var i in data) {
                lis = lis + '<li role="presentation"><a name="searchListItemName" role="menuitem" tabindex="-1" data-id="' + data[i].id + '" data-name="' + data[i].name + '"><span>' + data[i].name + '</span></a></li>';
            }
            $('#' + searchList).append(lis);
            $("a[name='searchListItemName']").click(function () {
                var id = $(this).data("id");
                var name = $(this).data("name");
                selectItem(searchField, id, name, params, callback);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

var clearSearch =  function(searchField){
    clearSelect(searchField);
};

var selectItem = function (searchField, itemValue, itemText, params, callback) {
    $("#" + searchField).val(itemText);
    callback(itemValue, params);
};

var clearSelect = function(searchField){
    $("#" + searchField).val('');
};

var clearList = function(selectlist,menu){
    $('#' + menu).empty();
    var lis = '';
    lis = lis + '<li><a href="#"><span>无数据</span></a></li>';
    $('#' + menu).append(lis);
    $('#' + selectlist).selectlist('disable');
    $('#' + selectlist).selectlist('selectByIndex', 0);
};

var initList = function(selectlist, menu, data, callback){
    $('#' + menu).empty();
    var lis = '<li><a href="#">请选择==></a></li>';
    if(data.length > 0 ){
        for (var i in data) {
            lis = lis + '<li data-value="' + data[i].id + '"><a href="#">' + data[i].name + '</a></li>';
        }
        $('#' + menu).append(lis);
        $('#' + selectlist).selectlist('enable');
        $('#' + selectlist).selectlist('selectByIndex', 0);
    }else{
        clearList(selectlist,menu);
    }
    if(callback != null){
        callback();
    }
};

var showSuccess = function(msg){
    $("#infoPanel").jqxNotification({
        width: 250, position: "top-left", opacity: 0.9,
        autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 3000, template: "success"
    });
    $('#infoPanel').html('<span class="icon icon-ok"></span>' + msg);
    $("#infoPanel").jqxNotification("open");
}

var showError = function(msg){
    $("#infoPanel").jqxNotification({
        width: 250, position: "top-left", opacity: 0.9,
        autoOpen: false, animationOpenDelay: 800, autoClose: true, autoCloseDelay: 3000, template: "error"
    });
    $('#infoPanel').html('<span class="icon icon-error"></span>' + msg);
    $("#infoPanel").jqxNotification("open");
}

var showContentPanel = function( panelUrl,param,callback ){
    $.ajax({
        data: param,
        url: panelUrl,
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $("#contentPanel").html(data.htmlContent);
                callback();
            }
            else {
                showErrorMsg(data.errorHead, data.errorMsg);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorMsgDefault();
        }
    });
}

var initSectionListWULF = function (actionId, callback) {
    var params = {"actionId": actionId};
    $.ajax({
        data: params,
        url: '/getUserActionSection',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            initList('addQuote_section', 'addQuote_sectionList', data, callback);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var initSectionList = function (actionId) {
    var params = {"actionId": actionId};
    var sectionSource =
    {
        datatype: "json",
        data: params,
        async: false,
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'}
        ],
        url: '/getUserActionSection'
    };
    var sectionDataAdapter = new $.jqx.dataAdapter(sectionSource);

    $("#commonDropdown_userActionSection").jqxDropDownList({
        source: sectionDataAdapter,
        selectedIndex: 1,
        width: '200',
        height: '25',
        displayMember: 'name',
        valueMember: 'id'
    });
};

var showTableOperationButton = function( container, buttonId, buttonName, clickFunc){
    container.append(getTabelButtonHTML(buttonId, buttonName));
    $('#' + buttonId).jqxButton();
    $('#' + buttonId).on('click', clickFunc);
}

var createToolbarContiner = function(){
    return $('<div class="btn-group" style="margin: 5px;"></div>');
}

var getTabelButtonHTML = function(buttonId, buttonName){
    return '<button id="' + buttonId + '" class="btn btn-small">' + buttonName + '</button>';
}
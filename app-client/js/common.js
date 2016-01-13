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
                lis = lis + '<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:selectItem(\'' + searchField + '\',\'' + data[i].id + '\',\'' + data[i].name + '\',' + callback + ')"><span>' + data[i].name + '</span></a></li>';
            }
            $('#' + searchList).append(lis);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

var clearSearch =  function(searchField){
    clearSelect(searchField);
};

var selectItem = function (searchField, itemValue, itemText, callback) {
    $("#" + searchField).val(itemText);
    callback(itemValue);
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
    var lis = '';
    if(data.length > 0 ){
        for (var i in data) {
            lis = lis + '<li data-value="' + data[i].id + '"><a href="#"><span>' + data[i].name + '</span></a></li>';
        }
        $('#' + menu).append(lis);
        $('#' + selectlist).selectlist('enable');
        $('#' + selectlist).selectlist('selectByIndex', 0);
    }else{
        clearList(selectlist,menu);
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

var showContentPanel = function( panelUrl,data,callback ){
    $.ajax({
        data: data,
        url: panelUrl,
        type: 'post',
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
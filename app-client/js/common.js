var searchDropdown = function (searchList, searchField, callback) {
    $('#' + searchList).empty();
    var params = {
        companyName: $('#' + searchField).val()
    };
    $.ajax({
        data: params,
        url: '/getCompany',
        type: 'post',
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

var initList = function(selectlist, menu, data){
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

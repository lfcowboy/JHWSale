/**
 * Created by fenglv on 2015/8/9.
 */
 $("#addCompanyButton").click(function(){
    var params ={
        name: $("#addCompany_name").val()
    };
    $.ajax({
        data: params,
        url: '/addCompany',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $("#addCompanyPanel").hide();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});

 $("#addCustomerButton").click(function(){
    var params ={
        companyName: $('#addCustomer_companyName').val(),
        name: $("#addCustomer_name").val()
    };
    $.ajax({
        data: params,
        url: '/addCustomer',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function(data){
            if(data.success){
                showConfirmMsg(data.confirmHead,data.confirmMsg);
                $('#addCustomerDialog').modal('hide');
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            showErrorMsgDefault();
        }
    });
});

 $('#addCustomer_companySearch').click(function(){
     var params = {"companyName": $('#addCustomer_companyName').val()};
    searchDropdown('addCustomer_companyList', 'addCustomer_companyName', params, '/getCompany', function(){});
});

var initCompanyListPanel = function () {
    initCompanyListTable();
}

var initCompanyListTable = function () {
    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'}
        ],
        url: '/getCompanys'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '100%'
        }
    ];

    // initialize jqxGrid
    $('#companyListTable').jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            selectionmode: 'singlerow',
            pageable: true,
            autoheight: true,
            filterable: true,
            showfilterrow: true,
            altRows: true,
            columns: columns,
            scrollBarSize: 8
        });
    $('#companyListTable').jqxGrid({rowsheight: 28});
}

var initCustomerListPanel = function () {
    initCustomerListTable();
}

var initCustomerListTable = function () {
    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'},
            {name: 'companyName', type: 'string'}
        ],
        url: '/getCustomers'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '50%'
        },{
            text: '公司',
            datafield: 'companyName',
            filtertype: 'input',
            width: '50%'
        }
    ];

    // initialize jqxGrid
    $('#customerListTable').jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            selectionmode: 'singlerow',
            pageable: true,
            autoheight: true,
            filterable: true,
            showfilterrow: true,
            altRows: true,
            columns: columns,
            scrollBarSize: 8
        });
    $('#customerListTable').jqxGrid({rowsheight: 28});
}
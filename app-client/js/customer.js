/**
 * Created by fenglv on 2015/8/9.
 */

var initAddCompanyPanel = function(){
    var addCompanyButton = $('#addCompanyButton');

    var mandatoryValidation =  function(){
        addCompanyButton.prop( 'disabled', false );
        mandatoryIconControl($('#addCompany_name'), addCompanyButton);
    }

    mandatoryValidation();

    $( '#addCompany_name').on( 'keyup change', function( e ) {
        mandatoryValidation();
    } );

    addCompanyButton.click(function(){
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
}

var initAddCustomerPanel = function(){
    var addCustomerButton = $('#addCustomerButton');

    var mandatoryValidation =  function(){
        addCustomerButton.prop( 'disabled', false );
        mandatoryIconControl($('#addCustomer_name'), addCustomerButton);
        mandatoryIconControl($('#addCustomer_tel'), addCustomerButton);
    }

    mandatoryValidation();

    $( '#addCustomer_name,#addCustomer_tel').on( 'keyup change', function( e ) {
        mandatoryValidation();
    } );

    $('#addCustomer_companySearch').click(function(){
        var params = {"companyName": $('#addCustomer_companyName').val()};
        searchDropdown('addCustomer_companyList', 'addCustomer_companyName', params, '/getCompany', function(){});
    });

    addCustomerButton.click(function(){
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
}

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
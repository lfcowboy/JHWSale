/**
 * Created by fenglv on 2015/8/9.
 */
$("#addQuoteButton").click(function () {
    var params = {
        quoteNum: $("#addQuote_quoteNum").val(),
        companyName: $("#addQuote_companyName").val(),
        currency: $('input[name="currency"]:checked').val(),
        customerId: $("#addQuote_quoteNum").val(),
        remark: $("#addQuote_remark").val()
    };
    $.ajax({
        data: params,
        url: '/addQuote',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $("#addQuotePanel").hide();
                $("#addPricePanel").html(data.htmlContent);
                initPriceTable(data.quoteId);
                $("#pricePanel").show();
                showSuccess(data.msg);
            }
            else {
                showErrorMsg(data.errorHead, data.errorMsg);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showErrorMsgDefault();
        }
    });
});

var initAddQuote = function init() {
    $.ajax({
        url: '/getNewQuoteNum',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $('#addQuote_quoteNum').val(data.newQuoteNum);
                initDefaultRemarkList();
                //showConfirmMsg(data.confirmHead,data.confirmMsg);
                //$("#addQuotePanel").hide();
            }
            //var data = $.parseJSON(data);
            //alert(data.message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert("报价单创建失败，请重试或者联系管理员!");
            //alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

$('#addQuote_companySearch').click(function () {
    searchDropdown('addQuote_companyList', 'addQuote_companyName', function (companyId) {
        initCustomerList(companyId);
    });
});

var initCustomerList = function (companyId) {
    var params = {
        companyId: companyId
    };
    $.ajax({
        data: params,
        url: '/getCustomer',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            initList('addQuote_customer', 'addQuote_customerList', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var clearCompany = function () {
    clearSelect('addQuote_companyName');
    clearList('addQuote_customer', 'addQuote_customerList');
};

var initDefaultRemarkList = function () {
    $.ajax({
        url: '/getDefaultRemarks',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            initList('addQuote_addRemark', 'addQuote_addRemarkList', data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

$('#addQuote_addRemark').on('changed.fu.selectlist', function (event, data) {
    //alert($("#remark").val());
    $("#remark").val($("#remark").val() + data.text + '\n');
    //$("#remark").append(data.text + '\n');
});

var productSource =
{
    datatype: "json",
    datafields: [
        {name: 'id'},
        {name: 'code'}
    ],
    url: '/getProduct',
    async: false
};
var productDataAdapter = new $.jqx.dataAdapter(productSource, {
    autoBind: true
});

var initPriceTable = function (quoteId) {
        /*---------------- test data ----------------*/
        var data = new Array();
        data[0] = {};

        var generaterow = function (i) {
            var row = {};
            row["server"] = '1';
            return row;
        }

        var source =
        {
            datatype: "json",
            datafields: [
                {name: 'id', type: 'string'},
                {
                    name: 'product',
                    value: 'productId',
                    values: {source: productDataAdapter.records, value: 'id', name: 'code'}
                },
                {name: 'productId', type: 'string'},
                {name: 'min', type: 'number'},
                {name: 'max', type: 'number'},
                {name: 'price', type: 'number'},
                {name: 'tax', type: 'number'},
                {name: 'privateRemark', type: 'string'},
                {name: 'publicRemark', type: 'Image'}
            ],
            url: '/getPriceByQuoteId?quoteId=' + quoteId,
            addrow: function (rowid, rowdata, position, commit) {
                commit(true);
            },
            deleterow: function (rowid, commit) {
                var data = $('#table-alternating-cell-selection').jqxGrid('getrowdata', rowid);
                if (data.id === undefined) {
                    commit(true);
                }else {
                    $.ajax({
                        data: data,
                        url: '/deletePrice',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        timeout: 5000,
                        success: function (data) {
                            if (data.success) {
                                showSuccess(data.msg);
                                commit(true);
                            }
                            else {
                                showErrorMsg(data.errorHead, data.errorMsg);
                                commit(false);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            showErrorMsgDefault();
                            commit(false);
                        }
                    });
                }
            }
            ,
            updaterow: function (rowid, newdata, commit) {
                var url;
                if (newdata.id === undefined) {
                    url = '/addPrice';
                }
                else {
                    url = '/updatePrice';
                }
                newdata.quoteId = $('#pricePanel').data('quoteId');
                $.ajax({
                    data: newdata,
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    timeout: 5000,
                    success: function (data) {
                        if (data.success) {
                            newdata.id = data.id;
                            showSuccess(data.msg);
                            commit(true);
                        }
                        else {
                            showErrorMsg(data.errorHead, data.errorMsg);
                            commit(false);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showErrorMsgDefault();
                        commit(false);
                    }
                });
            }
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        var columns = [
            {
                text: '产品型号',
                datafield: 'productId',
                displayfield: 'product',
                columntype: 'dropdownlist',
                width: '10%',
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: productDataAdapter, displayMember: 'code', valueMember: 'id'});
                }
            },
            {
                text: '最小量',
                columntype: 'numberinput',
                datafield: 'min',
                filtertype: 'input',
                width: '10%'
            },
            {
                text: '最大量',
                columntype: 'numberinput',
                datafield: 'max',
                filtertype: 'input',
                width: '10%'
            },
            {
                text: '价格',
                columntype: 'numberinput',
                datafield: 'price',
                cellsformat: "f2",
                width: '5%'
            },
            {
                text: '税',
                columntype: 'numberinput',
                datafield: 'tax',
                cellsformat: "p",
                width: '5%'
            },
            {
                text: '内部备注',
                columntype: 'textbox',
                datafield: 'privateRemark',
                filtertype: 'input',
                width: '25%'
            },
            {
                text: '外部备注',
                columntype: 'textbox',
                datafield: 'publicRemark',
                filtertype: 'input'
            }
        ]
        // initialize jqxGrid
        $("#table-alternating-cell-selection").jqxGrid(
            {
                width: '100%',
                height: '90%',
                source: dataAdapter,
                editable: true,
                selectionmode: 'singlerow',
                editmode: 'selectedrow',
                enableBrowserSelection: false,
                autoshowcolumnsmenubutton: true,
                altRows: true,
                columns: columns,
                scrollBarSize: 8,
                showtoolbar: true,
                autosavestate: false,
                rendertoolbar: function (toolbar) {
                    var me = this;
                    var container = $("<div class='btn-group' style='margin: 5px;'></div>");
                    toolbar.append(container);
                    container.append('<button id="addrowbutton" class="btn btn-small" >添加</button>');
                    container.append('<button id="deleterowbutton" class="btn btn-small">删除</button>');
                    $("#addrowbutton").jqxButton();
                    $("#deleterowbutton").jqxButton();
                    // create new row.
                    $("#addrowbutton").on('click', function () {
                        var datarow = generaterow();
                        var commit = $("#table-alternating-cell-selection").jqxGrid('addrow', null, datarow);
                    });
                    // delete row.
                    $("#deleterowbutton").on('click', function () {
                        var selectedrowindex = $("#table-alternating-cell-selection").jqxGrid('getselectedrowindex');
                        var rowscount = $("#table-alternating-cell-selection").jqxGrid('getdatainformation').rowscount;
                        if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                            var id = $("#table-alternating-cell-selection").jqxGrid('getrowid', selectedrowindex);
                            var commit = $("#table-alternating-cell-selection").jqxGrid('deleterow', id);
                        }
                    });
                }
            });
        $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'severity', 'editable', false);
        $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'alarmnumber', 'editable', false);
        $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'alarmtext', 'editable', false);
        $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'cancel', 'editable', false);
        $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'alarmtime', 'editable', false);
        $('#table-alternating-cell-selection').jqxGrid({rowsheight: 28});
    }

var showPriceListTable = function(){
    $.ajax({
        url: '/getPriceTable',
        type: 'post',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            if (data.success) {
                $("#priceListPage").html(data.htmlContent);
                initPriceListTable();
                $("#priceListPanel").show();
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

var initPriceListTable = function () {
    /*---------------- test data ----------------*/
    var data = new Array();
    data[0] = {};

    var generaterow = function (i) {
        var row = {};
        row["server"] = '1';
        return row;
    }

    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {
                name: 'product',
                value: 'productId',
                values: {source: productDataAdapter.records, value: 'id', name: 'code'}
            },
            {name: 'productId', type: 'string'},
            {name: 'productCode', type: 'string'},
            {name: 'min', type: 'number'},
            {name: 'max', type: 'number'},
            {name: 'price', type: 'number'},
            {name: 'tax', type: 'number'},
            {name: 'privateRemark', type: 'string'},
            {name: 'publicRemark', type: 'string'},
            {name: 'remark', type: 'string'},
            {name: 'quoteId', type: 'string'},
            {name: 'quoteNum', type: 'string'},
            {name: 'company', type: 'string'},
            {name: 'customer', type: 'string'},
            {name: 'quoteDate', type: 'string'},
            {name: 'quotor', type: 'string'}
        ],
        url: '/getPrice'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '产品编号',
            datafield: 'productCode',
            width: '10%',
            createeditor: function (row, value, editor) {
                editor.jqxDropDownList({source: productDataAdapter, displayMember: 'code', valueMember: 'id'});
            }
        },
        {
            text: '最小量',
            columntype: 'textbox',
            datafield: 'min',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '最大量',
            columntype: 'textbox',
            datafield: 'max',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '价格',
            columntype: 'textbox',
            datafield: 'price',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '税',
            columntype: 'textbox',
            datafield: 'tax',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '内部备注',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'privateRemark',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '外部备注',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'publicRemark',
            filtertype: 'input'
        },
        {
            text: '备注',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'remark',
            filtertype: 'input'
        },
        {
            text: '报价单号',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'quoteNum',
            filtertype: 'input'
        },
        {
            text: '公司名称',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'company',
            filtertype: 'input'
        },
        {
            text: '联系人',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'customer',
            filtertype: 'input'
        },
        {
            text: '报价时间',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'quoteDate',
            filtertype: 'input'
        },
        {
            text: '报价人',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'quotor',
            filtertype: 'input'
        }
    ];

    var columngroups =
        [
            { text: 'Product Details', align: 'center', name: 'ProductDetails' },
            { text: 'Order Details', parentgroup: 'ProductDetails', align: 'center', name: 'OrderDetails' },
            { text: '报价', align: 'center', name: 'price' }
        ];

    // initialize jqxGrid
    $("#priceListTable").jqxGrid(
        {
            width: '100%',
            height: '90%',
            source: dataAdapter,
            editable: false,
            selectionmode: 'singlerow',
            editmode: 'selectedrow',
            enableBrowserSelection: false,
            autoshowcolumnsmenubutton: true,
            altRows: true,
            columns: columns,
            columngroups:columngroups,
            scrollBarSize: 8,
            autosavestate: false
        });
    $("#priceListTable").jqxGrid('setcolumnproperty', 'severity', 'editable', false);
    $("#priceListTable").jqxGrid('setcolumnproperty', 'alarmnumber', 'editable', false);
    $("#priceListTable").jqxGrid('setcolumnproperty', 'alarmtext', 'editable', false);
    $("#priceListTable").jqxGrid('setcolumnproperty', 'cancel', 'editable', false);
    $("#priceListTable").jqxGrid('setcolumnproperty', 'alarmtime', 'editable', false);
    $('#priceListTable').jqxGrid({rowsheight: 28});
}

//var productList;
//var productCodeList = new Array();
//
//var initProductList = function () {
//    $.ajax({
//        url: '/getProduct',
//        type: 'get',
//        dataType: 'json',
//        cache: false,
//        timeout: 5000,
//        success: function (data) {
//            productList = data;
//            for (var i in productList) {
//                productCodeList[i] = productList[i].code;
//            }
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//        }
//    });
//};
//
//var initQuoteTable = function () {
//    initProductList();
//    /*---------------- image render/editor ----------------*/
//    var imagerenderer = function (row, datafield, value) {
//        return '<div class="text-center"><span class="icon ' + value + '"></span></div>';
//    };
//    /*---------------- test data ----------------*/
//    var data = new Array();
//    data[0] = {
//    };
//
//    var generaterow = function (i) {
//        var row = {};
//        row["server"] = '1';
//        return row;
//    }
//
//    var url = "/getPrice";
//
//    var source =
//    {
//        datatype: "json",
//        datafields: [
//            {name: 'acknowledgment', type: 'Image'},
//            {name: 'productCode', type: 'string'},
//            {name: 'min', type: 'number'},
//            {name: 'max', type: 'string'},
//            {name: 'price', type: 'string'},
//            {name: 'tax', type: 'bool'},
//            {name: 'privateRemark', type: 'string'},
//            {name: 'publicRemark', type: 'Image'}
//        ],
//        url: url,
//        addrow: function (rowid, rowdata, position, commit) {
//            // synchronize with the server - send insert command
//            // call commit with parameter true if the synchronization with the server is successful
//            //and with parameter false if the synchronization failed.
//            // you can pass additional argument to the commit callback which represents the new ID if it is generated from a DB.
//            commit(true);
//        },
//        deleterow: function (rowid, commit) {
//            // synchronize with the server - send delete command
//            // call commit with parameter true if the synchronization with the server is successful
//            //and with parameter false if the synchronization failed.
//            commit(true);
//        }
//        //,
//        //updaterow: function (rowid, newdata, commit) {
//        //    // synchronize with the server - send update command
//        //    // call commit with parameter true if the synchronization with the server is successful
//        //    // and with parameter false if the synchronization failed.
//        //    commit(true);
//        //}
//    };
//    var beginedit = function(row, datafield){
//        //if (row == 1 && datafield == 'product') {
//        //    return false;
//        //};
//    };
//    var dataAdapter = new $.jqx.dataAdapter(source);
//    var columns = [
//        {
//            text: '删除', columntype: 'custom', datafield: 'acknowledgment', filtertype: 'bool', width: '3%',
//            cellsrenderer: $.grid.nCheckboxCellsrenderer(""), createeditor: $.grid.nCreateCheckboxEditor(""),
//            initeditor: $.grid.nInitCheckboxEditor, geteditorvalue: $.grid.nGetCheckboxEditorValue
//        },
//        {
//            text: '产品型号', columntype: 'custom', datafield: 'productCode', displayfield:'productCode', filtertype: 'input', width: '10%',
//            cellsrenderer: $.grid.dropdownlistCellsrenderer,
//            createeditor: $.grid.dropdownlistEditor(productCodeList),
//            initeditor: $.grid.dropdownlistInitEditor,
//            geteditorvalue: $.grid.dropdownlistEditorValue,
//            cellbeginedit: beginedit
//        },
//        {
//            text: '最小量',
//            columntype: 'custom',
//            datafield: 'min',
//            filtertype: 'input',
//            cellsrenderer: $.grid.nTextFieldCellRenderer,
//            createeditor: $.grid.nCreateTextFieldEditor,
//            initeditor: $.grid.nInitTextFieldEditor,
//            geteditorvalue: $.grid.nGetTextFieldEditorValue,
//            width: '10%'
//        },
//        {
//            text: '最大量',
//            columntype: 'custom',
//            datafield: 'max',
//            filtertype: 'input',
//            cellsrenderer: $.grid.nTextFieldCellRenderer,
//            createeditor: $.grid.nCreateTextFieldEditor,
//            initeditor: $.grid.nInitTextFieldEditor,
//            geteditorvalue: $.grid.nGetTextFieldEditorValue,
//            width: '10%'
//        },
//        {
//            text: '价格',
//            columntype: 'custom',
//            datafield: 'price',
//            filtertype: 'input',
//            cellsrenderer: $.grid.nTextFieldCellRenderer,
//            createeditor: $.grid.nCreateTextFieldEditor,
//            initeditor: $.grid.nInitTextFieldEditor,
//            geteditorvalue: $.grid.nGetTextFieldEditorValue,
//            width: '5%'
//        },
//        {
//            text: '税',
//            columntype: 'custom',
//            datafield: 'tax',
//            filtertype: 'input',
//            cellsrenderer: $.grid.nTextFieldCellRenderer,
//            createeditor: $.grid.nCreateTextFieldEditor,
//            initeditor: $.grid.nInitTextFieldEditor,
//            geteditorvalue: $.grid.nGetTextFieldEditorValue,
//            width: '5%'
//        },
//        {
//            text: '内部备注',
//            columntype: 'custom',
//            datafield: 'privateRemark',
//            filtertype: 'input',
//            cellsrenderer: $.grid.nTextFieldCellRenderer,
//            createeditor: $.grid.nCreateTextFieldEditor,
//            initeditor: $.grid.nInitTextFieldEditor,
//            geteditorvalue: $.grid.nGetTextFieldEditorValue,
//            width: '25%'
//        },
//        {
//            text: '外部备注',
//            columntype: 'custom',
//            datafield: 'publicRemark',
//            filtertype: 'input',
//            cellsrenderer: $.grid.nTextFieldCellRenderer,
//            createeditor: $.grid.nCreateTextFieldEditor,
//            initeditor: $.grid.nInitTextFieldEditor,
//            geteditorvalue: $.grid.nGetTextFieldEditorValue
//        }
//    ]
//    // initialize jqxGrid
//    $("#table-alternating-cell-selection").jqxGrid(
//        {
//            width: '100%',
//            height: '90%',
//            source: dataAdapter,
//            editable: true,
//            editmode: 'click',
//            selectionmode: 'multiRow',
//            enableBrowserSelection: false,
//            autoshowcolumnsmenubutton: true,
//            altRows: true,
//            columns: columns,
//            scrollBarSize: 8,
//            showtoolbar: true,
//            autosavestate: false,
//            rendertoolbar: function (toolbar) {
//                var me = this;
//                var container = $("<div class='btn-group' style='margin: 5px;'></div>");
//                toolbar.append(container);
//                container.append('<button id="addrowbutton" class="btn btn-small" >添加</button>');
//                container.append('<button id="deleterowbutton" class="btn btn-small">删除</button>');
//                container.append('<button id="updaterowbutton" class="btn btn-small">保存</button>');
//                $("#addrowbutton").jqxButton();
//                $("#deleterowbutton").jqxButton();
//                $("#updaterowbutton").jqxButton();
//                // update row.
//                $("#updaterowbutton").on('click', function () {
//                    var selectedrowindex = $("#table-alternating-cell-selection").jqxGrid('getselectedrowindex');
//                    var rowscount = $("#table-alternating-cell-selection").jqxGrid('getdatainformation').rowscount;
//                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
//                        var datarow = $('#table-alternating-cell-selection').jqxGrid('getrowdata', 0);
//                        var id = $("#table-alternating-cell-selection").jqxGrid('getrowid', selectedrowindex);
//                        $.ajax({
//                            data: datarow,
//                            url: '/addPrice',
//                            type: 'post',
//                            dataType: 'json',
//                            cache: false,
//                            timeout: 5000,
//                            success: function (data) {
//                                if (data.success) {
//                                    showConfirmMsg(data.confirmHead, data.confirmMsg);
//                                    //$("#addQuotePanel").hide();
//                                }
//                                else {
//                                    showErrorMsg(data.errorHead, data.errorMsg);
//                                }
//                            },
//                            error: function (jqXHR, textStatus, errorThrown) {
//                                showErrorMsgDefault();
//                            }
//                        });
//                        //var commit = $("#table-alternating-cell-selection").jqxGrid('updaterow', id, datarow);
//                        //$("#table-alternating-cell-selection").jqxGrid('ensurerowvisible', selectedrowindex);
//                    }
//                });
//                // create new row.
//                $("#addrowbutton").on('click', function () {
//                    var datarow = generaterow();
//                    var commit = $("#table-alternating-cell-selection").jqxGrid('addrow', null, datarow);
//                });
//                // delete row.
//                $("#deleterowbutton").on('click', function () {
//                    var selectedrowindex = $("#table-alternating-cell-selection").jqxGrid('getselectedrowindex');
//                    var rowscount = $("#table-alternating-cell-selection").jqxGrid('getdatainformation').rowscount;
//                    alert(selectedrowindex);
//                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
//                        var id = $("#table-alternating-cell-selection").jqxGrid('getrowid', selectedrowindex);
//                        var commit = $("#table-alternating-cell-selection").jqxGrid('deleterow', id);
//                    }
//                });
//            }
//        });
//    $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'severity', 'editable', false);
//    $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'alarmnumber', 'editable', false);
//    $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'alarmtext', 'editable', false);
//    $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'cancel', 'editable', false);
//    $("#table-alternating-cell-selection").jqxGrid('setcolumnproperty', 'alarmtime', 'editable', false);
//    $('#table-alternating-cell-selection').jqxGrid({rowsheight: 28});
//    //$('#table-alternating-cell-selection').jqxGrid({ autoheight: true});
//};
/**
 * Created by fenglv on 2015/8/9.
 */
$("#addQuoteButton").click(function () {
    var params = {
        quoteNum: $("#addQuote_quoteNum").val(),
        companyName: $("#addQuote_companyName").val(),
        currency: $('input[name="currency"]:checked').val()
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
                showConfirmMsg(data.confirmHead, data.confirmMsg);
                $("#addQuotePanel").hide();
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

var productList;
var productCodeList = new Array();

var initProductList = function () {
    $.ajax({
        url: '/getProduct',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            productList = data;
            for (var i in productList) {
                productCodeList[i] = productList[i].code;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var initQuoteTable = function () {
    initProductList();
    /*---------------- image render/editor ----------------*/
    var imagerenderer = function (row, datafield, value) {
        return '<div class="text-center"><span class="icon ' + value + '"></span></div>';
    };
    /*---------------- test data ----------------*/
    var data = new Array();
    data[0] = {
        severity: 'icon-fault-critical',
        name: 'Avatar',
        alarmnumber: '113211',
        alarmtext: 'System module error',
        alarmtime: "1985/03/26",
        acknowledgment: "false",
        server: 'nokia',
        cancel: 'icon-fault-critical'
    };
    data[1] = {
        severity: 'icon-fault-major',
        name: 'Robert',
        alarmnumber: '113212',
        alarmtext: 'Rystem module error',
        alarmtime: "2001/10/26",
        acknowledgment: "false",
        server: 'huawei',
        cancel: 'icon-fault-major'
    };

    var generaterow = function (i) {
        var row = {};
        row["server"] = '1';
        return row;
    }

    var source =
    {
        localdata: data,
        datafields: [
            {name: 'severity', type: 'Image'},
            {name: 'name', type: 'string'},
            {name: 'alarmnumber', type: 'number'},
            {name: 'alarmtext', type: 'string'},
            {name: 'alarmtime', type: 'string'},
            {name: 'acknowledgment', type: 'bool'},
            {name: 'server', type: 'string'},
            {name: 'cancel', type: 'Image'}
        ],
        datatype: "array",
        addrow: function (rowid, rowdata, position, commit) {
            // synchronize with the server - send insert command
            // call commit with parameter true if the synchronization with the server is successful
            //and with parameter false if the synchronization failed.
            // you can pass additional argument to the commit callback which represents the new ID if it is generated from a DB.
            commit(true);
        },
        deleterow: function (rowid, commit) {
            // synchronize with the server - send delete command
            // call commit with parameter true if the synchronization with the server is successful
            //and with parameter false if the synchronization failed.
            commit(true);
        }
        //,
        //updaterow: function (rowid, newdata, commit) {
        //    // synchronize with the server - send update command
        //    // call commit with parameter true if the synchronization with the server is successful
        //    // and with parameter false if the synchronization failed.
        //    commit(true);
        //}
    };
    var beginedit = function(row, datafield){
        //if (row == 1 && datafield == 'product') {
        //    return false;
        //};
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    var columns = [
        {
            text: '删除', columntype: 'custom', datafield: 'acknowledgment', filtertype: 'bool', width: 45,
            cellsrenderer: $.grid.nCheckboxCellsrenderer, createeditor: $.grid.nCreateCheckboxEditor,
            initeditor: $.grid.nInitCheckboxEditor, geteditorvalue: $.grid.nGetCheckboxEditorValue
        },
        {
            text: '产品型号', columntype: 'custom', datafield: 'productCode', filtertype: 'input', width: 180,
            cellsrenderer: $.grid.dropdownlistCellsrenderer,
            createeditor: $.grid.dropdownlistEditor(productCodeList),
            initeditor: $.grid.dropdownlistInitEditor,
            geteditorvalue: $.grid.dropdownlistEditorValue,
            cellbeginedit: beginedit
        },
        {
            text: '最小量',
            columntype: 'custom',
            datafield: 'min',
            filtertype: 'input',
            cellsrenderer: $.grid.nTextFieldCellRenderer,
            createeditor: $.grid.nCreateTextFieldEditor,
            initeditor: $.grid.nInitTextFieldEditor,
            geteditorvalue: $.grid.nGetTextFieldEditorValue,
            width: 200
        },
        {
            text: '最大量',
            columntype: 'custom',
            datafield: 'max',
            filtertype: 'input',
            cellsrenderer: $.grid.nTextFieldCellRenderer,
            createeditor: $.grid.nCreateTextFieldEditor,
            initeditor: $.grid.nInitTextFieldEditor,
            geteditorvalue: $.grid.nGetTextFieldEditorValue,
            width: 200
        },
        {
            text: '价格',
            columntype: 'custom',
            datafield: 'price',
            filtertype: 'input',
            cellsrenderer: $.grid.nTextFieldCellRenderer,
            createeditor: $.grid.nCreateTextFieldEditor,
            initeditor: $.grid.nInitTextFieldEditor,
            geteditorvalue: $.grid.nGetTextFieldEditorValue,
            width: 200
        },
        {
            text: '税',
            columntype: 'custom',
            datafield: 'tax',
            filtertype: 'input',
            cellsrenderer: $.grid.nTextFieldCellRenderer,
            createeditor: $.grid.nCreateTextFieldEditor,
            initeditor: $.grid.nInitTextFieldEditor,
            geteditorvalue: $.grid.nGetTextFieldEditorValue,
            width: 200
        },
        {
            text: '内部备注',
            columntype: 'custom',
            datafield: 'privateRemark',
            filtertype: 'input',
            cellsrenderer: $.grid.nTextFieldCellRenderer,
            createeditor: $.grid.nCreateTextFieldEditor,
            initeditor: $.grid.nInitTextFieldEditor,
            geteditorvalue: $.grid.nGetTextFieldEditorValue,
            width: 200
        },
        {
            text: '外部备注',
            columntype: 'custom',
            datafield: 'publicRemark',
            filtertype: 'input',
            cellsrenderer: $.grid.nTextFieldCellRenderer,
            createeditor: $.grid.nCreateTextFieldEditor,
            initeditor: $.grid.nInitTextFieldEditor,
            geteditorvalue: $.grid.nGetTextFieldEditorValue,
            width: 200
        },
        {
            text: 'Severity',
            columntype: 'textbox',
            datafield: 'severity',
            filtertype: 'input',
            cellsrenderer: imagerenderer,
            width: 100
        },
        {
            text: 'Alarm number',
            columntype: 'NumberInput',
            datafield: 'alarmnumber',
            filtertype: 'number',
            cellsalign: 'right',
            align: "right",
            width: 150,
            cellbeginedit: beginedit
        },
        {text: 'Alarm text', columntype: 'textbox', datafield: 'alarmtext', filtertype: 'input', width: 150},
        {text: 'Alarm time', columntype: 'textbox', datafield: 'alarmtime', filtertype: 'input', width: 150},
        {
            text: 'Cancel',
            columntype: 'textbox',
            datafield: 'cancel',
            filtertype: 'input',
            cellsrenderer: imagerenderer,
            width: 100
        }
    ]
    // initialize jqxGrid
    $("#table-alternating-cell-selection").jqxGrid(
        {
            width: 1150,
            height: 190,
            source: dataAdapter,
            editable: true,
            editmode: 'click',
            selectionmode: 'multiRow',
            enableBrowserSelection: false,
            autoshowcolumnsmenubutton: true,
            altRows: true,
            columns: columns,
            scrollBarSize: 8,
            showtoolbar: true,
            autosavestate: false,
            rendertoolbar: function (toolbar) {
                var me = this;
                var container = $("<div style='margin: 5px;'></div>");
                toolbar.append(container);
                container.append('<input id="addrowbutton" type="button" value="Add New Row" />');
                container.append('<input style="margin-left: 5px;" id="deleterowbutton" type="button" value="Delete Selected Row" />');
                container.append('<input style="margin-left: 5px;" id="updaterowbutton" type="button" value="Update Selected Row" />');
                $("#addrowbutton").jqxButton();
                $("#deleterowbutton").jqxButton();
                $("#updaterowbutton").jqxButton();
                // update row.
                $("#updaterowbutton").on('click', function () {
                    var selectedrowindex = $("#table-alternating-cell-selection").jqxGrid('getselectedrowindex');
                    var rowscount = $("#table-alternating-cell-selection").jqxGrid('getdatainformation').rowscount;
                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                        var datarow = $('#table-alternating-cell-selection').jqxGrid('getrowdata', 0);
                        var id = $("#table-alternating-cell-selection").jqxGrid('getrowid', selectedrowindex);
                        $.ajax({
                            data: datarow,
                            url: '/addPrice',
                            type: 'post',
                            dataType: 'json',
                            cache: false,
                            timeout: 5000,
                            success: function (data) {
                                if (data.success) {
                                    showConfirmMsg(data.confirmHead, data.confirmMsg);
                                    //$("#addQuotePanel").hide();
                                }
                                else {
                                    showErrorMsg(data.errorHead, data.errorMsg);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                showErrorMsgDefault();
                            }
                        });
                        //var commit = $("#table-alternating-cell-selection").jqxGrid('updaterow', id, datarow);
                        //$("#table-alternating-cell-selection").jqxGrid('ensurerowvisible', selectedrowindex);
                    }
                });
                // create new row.
                $("#addrowbutton").on('click', function () {
                    var datarow = generaterow();
                    var commit = $("#table-alternating-cell-selection").jqxGrid('addrow', null, datarow);
                });
                // delete row.
                $("#deleterowbutton").on('click', function () {
                    var selectedrowindex = $("#table-alternating-cell-selection").jqxGrid('getselectedrowindex');
                    var rowscount = $("#table-alternating-cell-selection").jqxGrid('getdatainformation').rowscount;
                    alert(selectedrowindex);
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
};
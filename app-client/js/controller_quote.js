/**
 * Created by fenglv on 2015/8/9.
 */
var initAddQuote = function (actionId, quote) {
    initSectionListWULF(actionId, 'addQuote', function(){
        if(quote){
            $('#addQuote_section').selectlist('selectByValue', quote.sectionId);
        }
    });
    initDefaultRemarkList();

    $('#addQuote_companySearch').click(function () {
        var params = {"companyName": $('#addQuote_companyName').val()};
        searchDropdown('addQuote_companyList', 'addQuote_companyName', params, '/getCompany', function (companyId) {
            initCustomerList(companyId, function(){
                $('#addQuote_customer').selectlist('enable');
            });
        });
    });
    if (quote) {
        $("#addQuote_quoteNum").val(quote.quoteNum);
        $("#addQuote_companyName").val(quote.companyName);
        initCustomerList(quote.companyId, function () {
            $('#addQuote_customer').selectlist('selectByValue', quote.customerId);
        });
    } else {
        $.ajax({
            url: '/getNewQuoteNum',
            type: 'get',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    $('#addQuote_quoteNum').val(data.newQuoteNum);
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

    $("#addQuoteButton").click(function () {
        var url = '/addQuote';
        var quoteId;
        if (quote) {
            url = '/updateQuote';
            quoteId = quote.id;
        }

        var params = {
            id: quoteId,
            quoteNum: $("#addQuote_quoteNum").val(),
            sectionId: $("#addQuote_section").selectlist('selectedItem').value,
            companyName: $("#addQuote_companyName").val(),
            currency: $('input[name="currency"]:checked').val(),
            customerId: $("#addQuote_customer").selectlist('selectedItem').value,
            remark: $("#addQuote_remark").val()
        };

        $.ajax({
            data: params,
            url: url,
            type: 'post',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    var param = {"quoteId": data.quoteId};
                    $(".content-panel").hide();
                    showContentPanel('showPanel_editPriceList', param, function () {
                        initPriceTable(param.quoteId);
                    });
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
}

var initDefaultRemarkList = function () {
    $.ajax({
        url: '/getDefaultRemarks',
        type: 'get',
        dataType: 'json',
        cache: false,
        timeout: 5000,
        success: function (data) {
            initList('addQuote_addRemark', 'addQuote_addRemarkList', data);
            $('#addQuote_addRemark').on('changed.fu.selectlist', function (event, data) {
                $("#addQuote_remark").val($("#addQuote_remark").val() + data.text + '\n');
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var initCustomerList = function (companyId, callback) {
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
            initList('addQuote_customer', 'addQuote_customerList', data, callback);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var clearCompany = function () {
    clearSelect('addQuote_companyName');
    clearList('addQuote_customer', 'addQuote_customerList');
};

var chipSource =
{
    datatype: "json",
    datafields: [
        {name: 'id'},
        {name: 'code'}
    ],
    url: '/getChip',
    async: false
};
var chipDataAdapter = new $.jqx.dataAdapter(chipSource, {
    autoBind: true
});

var initPriceTable = function (quoteId) {
    /*---------------- test data ----------------*/
    var data = new Array();
    data[0] = {};

    var generaterow = function (i) {
        var row = {};
        return row;
    }

    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {
                name: 'chip',
                value: 'chipId',
                values: {source: chipDataAdapter.records, value: 'id', name: 'code'}
            },
            {name: 'chipId', type: 'string'},
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
            var data = $('#priceListEditTable').jqxGrid('getrowdata', rowid);
            if (data.id === undefined) {
                commit(true);
            } else {
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
            if (newdata.id === undefined || newdata.id =='' || newdata.id == null) {
                url = '/addPrice';
            }
            else {
                url = '/updatePrice';
            }
            newdata.quoteId = $('#addPricePanel').data('quoteId');
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
            text: '芯片型号',
            datafield: 'chipId',
            displayfield: 'chip',
            columntype: 'dropdownlist',
            width: '10%',
            createeditor: function (row, value, editor) {
                editor.jqxDropDownList({source: chipDataAdapter, displayMember: 'code', valueMember: 'id'});
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
    $("#priceListEditTable").jqxGrid(
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
                    var commit = $("#priceListEditTable").jqxGrid('addrow', null, datarow);
                });
                // delete row.
                $("#deleterowbutton").on('click', function () {
                    var selectedrowindex = $("#priceListEditTable").jqxGrid('getselectedrowindex');
                    var rowscount = $("#priceListEditTable").jqxGrid('getdatainformation').rowscount;
                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                        var id = $("#priceListEditTable").jqxGrid('getrowid', selectedrowindex);
                        var commit = $("#priceListEditTable").jqxGrid('deleterow', id);
                    }
                });
            }
        });
    $('#priceListEditTable').jqxGrid({rowsheight: 28});
}

var initMyQuoteListQueryPanel = function (param) {
    initQuoteListTable(param);
}

var initMyQuoteListEditPanel = function (param) {
    var editQuote = function () {
        var selectedrowindex = $("#quoteListTable").jqxGrid('getselectedrowindex');
        var rowscount = $("#quoteListTable").jqxGrid('getdatainformation').rowscount;
        if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
            var quote = $('#quoteListTable').jqxGrid('getrowdata', selectedrowindex);
            var data = {"quoteId": quote.id};
            $(".content-panel").hide();
            showContentPanel('showPanel_addQuote', data, function () {
                initAddQuote(param.actionId, quote);
            });
        }
    }

    var rendertoolbar = function (toolbar) {
        var container = createToolbarContiner();
        toolbar.append(container);
        showTableOperationButton(container, 'editrowbutton', '更新', editQuote);
    }

    initQuoteListTable(param, rendertoolbar);
}

var initMyQuoteListDeletePanel = function (param) {
    var deleteQuote = function () {
        var selectedrowindex = $("#quoteListTable").jqxGrid('getselectedrowindex');
        var rowscount = $("#quoteListTable").jqxGrid('getdatainformation').rowscount;
        if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
            var id = $("#quoteListTable").jqxGrid('getrowid', selectedrowindex);
            var commit = $("#quoteListTable").jqxGrid('deleterow', id);
            $("#quoteListSubTable").jqxGrid('clear');
        }
    }

    var rendertoolbar = function (toolbar) {
        var container = createToolbarContiner();
        toolbar.append(container);
        showTableOperationButton(container, 'deleterowbutton', '删除', deleteQuote);
    }

    initQuoteListTable(param, rendertoolbar);
}

var initMyQuoteListPrintPanel = function (param) {
    var rendertoolbar = function (toolbar) {
        var container = createToolbarContiner();
        toolbar.append(container);
        showTableOperationButton(container, 'printQuotebutton', '打印', printQuote);
    }

    var printQuote = function () {
        var selectedrowindex = $("#quoteListTable").jqxGrid('getselectedrowindex');
        var data = $('#quoteListTable').jqxGrid('getrowdata', selectedrowindex);
        $.ajax({
            data: data,
            url: '/showPrintQuotePanel',
            type: 'post',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    $("#printQuotePanel").html(data.htmlContent);
                    $("#printQuoteDialog_printButton").click(function () {
                        $("#quotePrintarea").printArea();
                    });
                    $("#printQuoteDialog").modal('show');
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

    initQuoteListTable(param, rendertoolbar);
}

var initQuoteListTable = function (filterParam, rendertoolbarfunc) {
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
        data: filterParam,
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'remark', type: 'string'},
            {name: 'quoteId', type: 'string'},
            {name: 'quoteNum', type: 'string'},
            {name: 'companyName', type: 'string'},
            {name: 'companyId', type: 'string'},
            {name: 'customerName', type: 'string'},
            {name: 'customerId', type: 'string'},
            {name: 'reportDate', type: 'string'},
            {name: 'reporter', type: 'string'},
            {name: 'sectionId', type: 'string'}
        ],
        url: '/getQuote',
        deleterow: function (rowid, commit) {
            var data = $('#quoteListTable').jqxGrid('getrowdata', rowid);
            $.ajax({
                data: data,
                url: '/deleteQuote',
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
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '报价单号',
            columntype: 'textbox',
            datafield: 'quoteNum',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '公司名称',
            columntype: 'textbox',
            datafield: 'companyName',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '联系人',
            columntype: 'textbox',
            datafield: 'customerName',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '报价时间',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'reportDate',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '报价人',
            columntype: 'textbox',
            columngroup: 'price',
            datafield: 'reporter',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '备注',
            columntype: 'textbox',
            datafield: 'remark',
            filtertype: 'input'
        }
    ];

    // initialize jqxGrid
    var quoteTableProps = {
        source: dataAdapter,
        columns: columns,
        pageable: true,
        width: '100%',
        editable: false,
        selectionmode: 'singlerow',
        filterable: true,
        autoheight: true,
        showfilterrow: true,
        altRows: true,
        scrollBarSize: 8,
        rowsheight: 28
    }

    if (rendertoolbarfunc) {
        quoteTableProps.showtoolbar = true;
        quoteTableProps.rendertoolbar = rendertoolbarfunc;
    }

    $("#quoteListTable").jqxGrid(quoteTableProps);

    initQuoteListSubTable();
    $("#quoteListTable").on('rowselect', function (event) {
        var subSource =
        {
            datatype: "json",
            datafields: [
                {name: 'id', type: 'string'},
                {name: 'chipCode', type: 'string'},
                {name: 'min', type: 'string'},
                {name: 'max', type: 'string'},
                {name: 'price', type: 'string'},
                {name: 'tax', type: 'string'},
                {name: 'privateRemark', type: 'string'},
                {name: 'publicRemark', type: 'string'}
            ],
            url: '/getPriceByQuoteId?quoteId=' + event.args.row.id
        };

        var subDataAdapter = new $.jqx.dataAdapter(subSource);

        // update data source.
        $("#quoteListSubTable").jqxGrid({source: subDataAdapter});
    });
}

var initQuoteListSubTable = function () {
    var columns = [
        {
            text: '芯片型号',
            datafield: 'chipCode',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '最小量',
            datafield: 'min',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '最大量',
            datafield: 'max',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '价格',
            datafield: 'price',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '税',
            datafield: 'tax',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '内部备注',
            datafield: 'privateRemark',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '外部备注',
            datafield: 'publicRemark',
            filtertype: 'input'
        }
    ];

    // initialize jqxGrid
    $("#quoteListSubTable").jqxGrid(
        {
            width: '100%',
            autoheight: true,
            selectionmode: 'singlerow',
            filterable: true,
            showfilterrow: true,
            altRows: true,
            columns: columns,
            scrollBarSize: 8
        });
    $('#quoteListSubTable').jqxGrid({rowsheight: 28});
}

var initPriceListTable = function () {
    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {
                name: 'chip',
                value: 'chipId',
                values: {source: chipDataAdapter.records, value: 'id', name: 'code'}
            },
            {name: 'chipId', type: 'string'},
            {name: 'chipCode', type: 'string'},
            {name: 'min', type: 'string'},
            {name: 'max', type: 'string'},
            {name: 'price', type: 'string'},
            {name: 'tax', type: 'string'},
            {name: 'privateRemark', type: 'string'},
            {name: 'publicRemark', type: 'string'},
            {name: 'remark', type: 'string'},
            {name: 'quoteId', type: 'string'},
            {name: 'quoteNum', type: 'string'},
            {name: 'companyName', type: 'string'},
            {name: 'customerName', type: 'string'},
            {name: 'reportDate', type: 'string'},
            {name: 'reporter', type: 'string'}
        ],
        url: '/getPrice'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '芯片型号',
            datafield: 'chipCode',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '最小量',
            datafield: 'min',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '最大量',
            datafield: 'max',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '价格',
            datafield: 'price',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '税',
            datafield: 'tax',
            filtertype: 'input',
            width: '5%'
        },
        {
            text: '内部备注',
            datafield: 'privateRemark',
            filtertype: 'input',
            width: '10%'
        },
        {
            text: '外部备注',
            datafield: 'publicRemark',
            filtertype: 'input'
        },
        {
            text: '报价单号',
            datafield: 'quoteNum',
            filtertype: 'input'
        },
        {
            text: '公司名称',
            datafield: 'companyName',
            filtertype: 'input'
        },
        {
            text: '联系人',
            datafield: 'customerName',
            filtertype: 'input'
        },
        {
            text: '报价时间',
            datafield: 'reportDate',
            filtertype: 'input'
        },
        {
            text: '报价人',
            datafield: 'reporter',
            filtertype: 'input'
        },
        {
            text: '备注',
            datafield: 'remark',
            filtertype: 'input'
        },
    ];

    // initialize jqxGrid
    $("#priceListTable").jqxGrid(
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
    $('#priceListTable').jqxGrid({rowsheight: 28});
}

//var chipList;
//var chipCodeList = new Array();
//
//var initChipList = function () {
//    $.ajax({
//        url: '/getChip',
//        type: 'get',
//        dataType: 'json',
//        cache: false,
//        timeout: 5000,
//        success: function (data) {
//            chipList = data;
//            for (var i in chipList) {
//                chipCodeList[i] = chipList[i].code;
//            }
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//        }
//    });
//};
//
//var initQuoteTable = function () {
//    initChipList();
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
//            {name: 'chipCode', type: 'string'},
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
//        //if (row == 1 && datafield == 'chip') {
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
//            text: '芯片型号', columntype: 'custom', datafield: 'chipCode', displayfield:'chipCode', filtertype: 'input', width: '10%',
//            cellsrenderer: $.grid.dropdownlistCellsrenderer,
//            createeditor: $.grid.dropdownlistEditor(chipCodeList),
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
//    $("#priceListEditTable").jqxGrid(
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
//                    var selectedrowindex = $("#priceListEditTable").jqxGrid('getselectedrowindex');
//                    var rowscount = $("#priceListEditTable").jqxGrid('getdatainformation').rowscount;
//                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
//                        var datarow = $('#priceListEditTable').jqxGrid('getrowdata', 0);
//                        var id = $("#priceListEditTable").jqxGrid('getrowid', selectedrowindex);
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
//                        //var commit = $("#priceListEditTable").jqxGrid('updaterow', id, datarow);
//                        //$("#priceListEditTable").jqxGrid('ensurerowvisible', selectedrowindex);
//                    }
//                });
//                // create new row.
//                $("#addrowbutton").on('click', function () {
//                    var datarow = generaterow();
//                    var commit = $("#priceListEditTable").jqxGrid('addrow', null, datarow);
//                });
//                // delete row.
//                $("#deleterowbutton").on('click', function () {
//                    var selectedrowindex = $("#priceListEditTable").jqxGrid('getselectedrowindex');
//                    var rowscount = $("#priceListEditTable").jqxGrid('getdatainformation').rowscount;
//                    alert(selectedrowindex);
//                    if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
//                        var id = $("#priceListEditTable").jqxGrid('getrowid', selectedrowindex);
//                        var commit = $("#priceListEditTable").jqxGrid('deleterow', id);
//                    }
//                });
//            }
//        });
//    $("#priceListEditTable").jqxGrid('setcolumnproperty', 'severity', 'editable', false);
//    $("#priceListEditTable").jqxGrid('setcolumnproperty', 'alarmnumber', 'editable', false);
//    $("#priceListEditTable").jqxGrid('setcolumnproperty', 'alarmtext', 'editable', false);
//    $("#priceListEditTable").jqxGrid('setcolumnproperty', 'cancel', 'editable', false);
//    $("#priceListEditTable").jqxGrid('setcolumnproperty', 'alarmtime', 'editable', false);
//    $('#priceListEditTable').jqxGrid({rowsheight: 28});
//    //$('#priceListEditTable').jqxGrid({ autoheight: true});
//};
/**
 * Created by fenglv on 2016/1/5.
 */
var initUserListTable = function () {
    var source =
    {
        datatype: "json",
        datafields: [
            {name: 'id', type: 'string'},
            {name: 'account', type: 'string'},
            {name: 'name', type: 'string'}
        ],
        url: '/getSubUsers'
    };

    var dataAdapter = new $.jqx.dataAdapter(source);

    var columns = [
        {
            text: '帐号',
            datafield: 'account',
            filtertype: 'input',
            width: '50%'
        },
        {
            text: '名字',
            datafield: 'name',
            filtertype: 'input',
            width: '50%'
        }
    ];

    var initrowdetails = function(index, parentElement, gridElement, datarecord){
        console.log('index' + index);
        console.log('parentElement' + parentElement);
        console.log('gridElement' + gridElement);
        console.log('datarecord' + datarecord);
    }

    // initialize jqxGrid
    $('#userListTable').jqxGrid(
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
            scrollBarSize: 8,
            rowdetails: true,
            initrowdetails: initrowdetails,
            rowdetailstemplate: { rowdetails: "<div style='margin: 10px;'><div class='checkbox checkbox-small'><input id='xx' type='checkbox'><label for='xx'>销售员</label></div><div class='checkbox checkbox-small'><input id='xx1' type='checkbox'><label for='xx1'>销售主管</label></div><div class='checkbox checkbox-small'><input id='xx2' type='checkbox'><label for='xx2'>销售总监</label></div></div>", rowdetailsheight: 100 }
        });
    $('#userListTable').jqxGrid({rowsheight: 28});
}
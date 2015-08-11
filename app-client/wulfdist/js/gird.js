/**
 * Created by linaqiu on 2015/8/5.
 */
$.grid = {
    /*---------------- nokia TextField render/editor ----------------*/
    nTextFieldCellRenderer: function (row, column, value) {
        return '<input class="n-inputfield n-inputfield-small" value="' + value + '" />';
    },

    /*---------------- nokia Checkbox render/editor ----------------*/
    nCheckboxCellsrenderer: function (row, column, value) {
        return '<div class="checkbox checkbox-small">'+ '<input id="cb' + row +'" type="checkbox" ' + (value?' checked="true"':'')+ '></input>'+ '<label for="cb' + row +'">checkbox</label>'+ '</div>';
    },

    /*---------------- nokia dropdownlist render/editor ----------------*/
    dropdownlistCellsrenderer : function (row, columnfield, value) {
        return '<div class="btn-group selectlist selectlist-small selectlist-resize" data-resize="none" data-initialize="selectlist" id="mySelectlist7">'+
            '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">'+
            '<span class="selected-label">'+value+'</span>'+
            '<span class="selected-caret" ><span class="caret"></span></span>'+
            '</button>'+'<ul class="dropdown-menu" role="menu">'+
            '<li data-value="1">'+'<a href="#">'+'<span>'+value+'</span>'+'</a>'+'</li>'+
            '<li data-value="2">'+'<a href="#">'+'<span>'+'nokia'+'</span>'+'</a>'+'</li>'+
            '</ul>'+'</div>';
    },

    dropdownlistEditor: function (row, cellValue, editor, cellText, width, height) {
        // construct the editor.
        console.log(" row:"+row + "cellValue:" + cellValue +"cellText:"+cellText);
        var element = $('<div class="btn-group selectlist selectlist-small selectlist-resize" data-resize="none" data-initialize="selectlist" id="mySelectlist7">'+
            '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">'+
            '<span class="selected-label">'+cellValue+'</span>'+'<span class="selected-caret" ><span class="caret"></span></span>'+
            '</button>'+
            '<ul class="dropdown-menu" role="menu">'+
            '<li data-value="1">'+'<a href="#">'+'<span>'+'huawei'+'</span>'+'</a>'+'</li>'+
            '<li data-value="2">'+'<a href="#">'+'<span>'+'nokia'+'</span>'+'</a>'+'</li>'+
            '</ul>'+'</div>');
        editor.append(element);

    },

    dropdownlistInitEditor : function (row, cellValue, editor, cellText, width, height) {
        // set the editor's current value. The callback is called each time the editor is displayed.
        var inputHTMLElement = editor.find(".dropdown-toggle");
        console.log(" inputHTMLElement --"+inputHTMLElement);
        inputHTMLElement.focus();
    },

    dropdownlistEditorValue: function (row, cellValue, editor) {
        var inputHTMLElement = editor.find(".selected-label");
        return editor.val();
    },


    nCreateTextFieldEditor: function (row, cellValue, editor, cellText, width, height) {
        // construct the editor.
        var element = $('<input class="n-inputfield n-inputfield-small" />');
        editor.append(element);
    },

    nInitTextFieldEditor: function (row, cellValue, editor, cellText, width, height) {
        // set the editor's current value. The callback is called each time the editor is displayed.
        var inputHTMLElement = editor.find("input");
        inputHTMLElement.val(cellValue);
        inputHTMLElement.focus();
    },
    nGetTextFieldEditorValue: function (row, cellValue, editor) {
        return editor.find("input").val();
    }
};

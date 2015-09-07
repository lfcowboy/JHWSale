/**
 * Created by linaqiu on 2015/8/5.
 */
$.grid = {
    /*---------------- nokia TextField render/editor ----------------*/
    nTextFieldCellRenderer: function (row, column, value) {
        return '<input class="n-inputfield n-inputfield-small" value="' + value + '" />';
    },

    /*---------------- nokia Checkbox render/editor ----------------*/
    nCheckboxCellsrenderer: function (row, column, value,editor) {
        return '<div class="checkbox checkbox-small">'+ '<input id="cb' +row+ Date.now() +'" type="checkbox" ' + (value?' checked="true"':'')+ '></input>'+ '<label for="cb' +row+ Date.now() +'">checkbox</label>'+ '</div>';
    },
    nCreateCheckboxEditor: function (row, value, editor, cellText, width, height) {
        // construct the editor.
        var target = (value)?' checked="true"':'';
        var element = '<div class="checkbox checkbox-small margin-add-one">'+ '<input id="cb' +row+ Date.now() +'" type="checkbox" ' + (target)+ '></input>'+ '<label for="cb' +row+ Date.now() +'">checkbox</label>'+ '</div>';
        editor.append(element);
    },

    nInitCheckboxEditor: function (row, cellValue, editor, cellText, width, height) {
        // set the editor's current value. The callback is called each time the editor is displayed.
        var inputHTMLElement = editor.find("input");
        var current = inputHTMLElement.prop("checked");
        inputHTMLElement.prop({
            "checked": !current
        });
        inputHTMLElement.prop("checked");
        inputHTMLElement.focus();
    },
    nGetCheckboxEditorValue: function (row, cellValue, editor) {
        var inputHTMLElement = editor.find("input");
        return inputHTMLElement.prop("checked");
    },
    /*---------------- nokia dropdownlist render/editor ----------------*/
    dropdownlistCellsrenderer : function (row, columnfield, value) {
        return '<div class="btn-group selectlist selectlist-small selectlist-resize" data-resize="none" data-initialize="selectlist" id="mySelectlist7">'+
            '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">'+
            '<span class="selected-label">'+value+'</span>'+
            '<span class="selected-caret" ><span class="caret"></span></span>'+
            '</button>'+
            '<ul class="dropdown-menu" role="menu">'+
            '<li data-value="1">'+'<a href="#">'+'<span>'+value+'</span>'+'</a>'+'</li>'+
            '</ul>'+'</div>';
    },

    dropdownlistEditor: function (dropdownlists) {
        var _dropdownlists = dropdownlists;
        return function (row, cellValue, editor, cellText, width, height) {
            editor.jqxDropDownList(
                {
                    autoDropDownHeight: false,
                    itemHeight: 27,
                    dropDownHeight: '150px',
                    scrollBarSize: 8, width: width - 4, height: 24,
                    source: _dropdownlists.map(function (name) {
                        return "<span>" + name + "</span>";
                    })
                });
        }
    },

    dropdownlistInitEditor : function (row, cellValue, editor, cellText, width, height) {
        editor.jqxDropDownList('selectItem', '<span>'+cellValue+'</span>');
        editor.jqxDropDownList('open' );
    },

    dropdownlistEditorValue: function (row, cellValue, editor) {
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

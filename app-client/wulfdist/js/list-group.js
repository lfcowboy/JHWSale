/*
 * WULF (http://networks.nokia.com/)
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 */

$(document).ready(function () {
    $element = $(this);

    var is_multiple = $element.is('[n-list-multiple-selection]');

    // Todo not tested how the multiselection works
    if ($element.is('[n-list-multiple-selection]')) {
        $(".n-list-group").addClass('n-list-multiple-selection');
    }

    $("li.n-list-group-item").click(function (e) {
        e.preventDefault();

        var toggle = false;
        var $parent = $(this).parent();

        //Todo Check if the clicked item was already selected - in that case de-select it?
        if ($(this).hasClass("selected")) {
            toggle = true;
        }
        if ($parent.is('.selected')) {
            $parent.removeClass('selected');
            $(this).removeClass('selected');
        }
        if (!is_multiple) {
            $otherlist = $("ul.n-list-group");
            if ($otherlist.find('li.selected')) {
                $otherlist.removeClass('selected');
            }
            $parent.find('li').removeClass('selected');
            //$(this).parent().find('li').removeAttr('selected');
        }
        if (!toggle) {
        }
        $(this).addClass('selected');
        $parent.addClass('selected');
    });

    $("li.n-list-group-item").dblclick(function (e) {
        e.preventDefault();
    });

    $(".n-list-group-scroll").nScrollbar();
    $(".n-list-group-scroll-disabled").nScrollbar({
        alwaysShowScrollbar:2,
        theme: "disabled",
        mouseWheel:{ enable: false }
    });
    $(".n-list-group-scroll-disabled").nScrollbar("disable");
});

window.E = function () {
    var e = jQuery(document.createElement(arguments[0]));

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.shift();

        if (typeof args[0] == 'string') {
            e.addClass(args.shift())
        }

        for (var i = 0; i < args.length; i++) {
            if (args[i]) {
                if (!args[i].jquery && typeof args[i].length != "undefined") {
                    args[i].forEach(function (_e) {
                        e.append(_e)
                    })
                }
                else {
                    e.append(args[i])
                }
            }
        }
    }

    return e
};

/*
 (function ($) {
 // Create a listbox from element
 $.fn.listbox = function () {
 return this.each(function () {
 $source_select = $(this);
 alert($(this).html());
 if (!$source_select.is('ul'))
 {
 return;
 }
 alert($(this).html());
 $target_select = E('ul', 'listbox');
 alert(($target_select).html());

 var is_multiple = $source_select.is('[multiple]');
 $target_select.css('width', $source_select.width() + 'px');

 if ($source_select.is('[multiple]')) {
 $target_select.addClass('multiple')
 }

 var options = [];

 $source_select.find('n-list-group-item').each(function () {
 var $source_option = $(this);
 var $target_option = E('li');

 $target_option.append(E('a').attr('href', '#').append(E('span').html($source_option.html())));

 if ($source_option.is(':selected')) {
 $target_option.addClass('selected')
 }

 $target_option.find('span').click(function (e) {
 e.preventDefault();

 var $parent = $(this).parent();

 if ($parent.is('.selected')) {
 $parent.removeClass('selected');
 $source_option.removeAttr('selected')
 }
 else {
 if (!is_multiple) {
 $target_select.find('li.selected').removeClass('selected');
 $source_option.parent().find('option').removeAttr('selected')
 }

 $parent.addClass('selected');
 $source_option.attr('selected', 'true')
 }
 });

 options.push($target_option)
 });

 options[0].addClass('first');

 $target_select.appendlist(options);
 $source_select.after(E('div', 'select-list', $target_select));

 var size = parseInt($source_select.attr('size'));

 if (!size) {
 size = 5;
 }

 //$target_select.parent()
 //    .addClass('scrollbars vertical')
 //    .scrollbars()
 })
 };

 NSNReady(function () {
 // Automatically create listbox elements out of select elements
 // that are already on the page.
 $('select.listbox').hide().removeClass('listbox').listbox()
 alert($(this).html());
 })

 })(jQuery);

 if (!$element.is('ul'))
 {
 return;
 }
 var is_multiple = $element.is('[multiple]');
 if ($element.is('[multiple]'))
 {
 $parent.addClass('multiple')
 }

 $element.onselectstart = function () { return false; } // ie
 $element.onmousedown = function () { return false; } // mozilla
 */


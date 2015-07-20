/**
 * Created by linaqiu on 2015/7/1.
 */
+function () {
    var KEY = {up: 38, down: 40, right: 39, left: 37};

    /*---------------------- bind actions ----------------------*/
    $(".n-banner-tabs").on("mouseover", ".n-dropdown-menu-item-has-child", function () {
        showSubMenu($(this));
    });

    $(".n-banner-tabs").on("mouseleave", ".n-dropdown-menu-item-has-child", function () {
        hideSubMenu($(this).children(".n-dropdown-sub-menu"));
    });

    // add key event to show or close sub menu
    $(".n-banner-tabs").on("keydown", ".n-dropdown-menu-item-has-child", function (event) {
        // click right arrow, open sub menu;
        if (event.keyCode == KEY.right) {
            var $subMenu = $(this).children(".n-dropdown-sub-menu");
            if (!$subMenu.hasClass("open")) {
                showSubMenu($(this));
                $(this).blur();
                $subMenu.children("li").first().children("a").focus();
            }
        }
    });

    $(".n-banner-tabs").on("click",".n-banner-dropdown-toggle",function(){
        if ($(".n-dropdown-sub-menu.open").length !== 0) {
            $(".n-dropdown-sub-menu.open").removeClass("open");
        }
    });

    // add key event to move focus of sub menu item
    $(".n-banner").on("keydown", ".n-dropdown-sub-menu>li", function (event) {
        event.stopPropagation();
        // click up arrow
        if (event.keyCode == KEY.up) {
            setSubMenuItemFocus($(this), true);
        }
        // click down arrow
        else if (event.keyCode == KEY.down) {
            setSubMenuItemFocus($(this), false);
        }
        // click left arrow, close sub menu;
        else if (event.keyCode == KEY.left) {
            var $subMenu = $(this).parent(".n-dropdown-sub-menu");
            hideSubMenu($subMenu);
            $subMenu.prev("a").focus();
        }
    });

    // hide all sub menu
    $(document).on('click.bs.dropdown.data-api', function () {
        if ($(".n-dropdown-sub-menu.open").length !== 0) {
            $(".n-dropdown-sub-menu.open").removeClass("open");
        }
    });

    /*---------------------- functions ----------------------*/

    var showSubMenu = function ($parent) {
        var parentMenuWidth = $parent.parent("ul").innerWidth();
        var $subMenu = $parent.children(".n-dropdown-sub-menu");
        $subMenu.css("left", parentMenuWidth + "px");
        $subMenu.addClass("open");
    };

    var hideSubMenu = function ($subMenu) {
        $subMenu.removeClass("open");
    };

    var setSubMenuItemFocus = function ($item, isUpMove) {
        $item.siblings("li").children("a").blur();
        var prevItem = isUpMove ? $item.prev("li") : $item.next("li");
        if (prevItem.length === 0) {
            prevItem = isUpMove ? $item.parent().children("li").last() : $item.parent().children("li").first();
        }
        prevItem.children("a").focus();
    };
}();



/**
 * Created by linaqiu on 2015/6/12.
 */
$.fn.extend({
    initFlyout: function () {
        var $flyout = $(this);
        // set flyout container left position
        var $menuContainer = $flyout.find(".n-flyout-container");
        var menuWidth = $menuContainer.outerWidth();
        var menuHeight = $menuContainer.outerHeight();
        $flyout.css("left", (-menuWidth) + "px");
        // set flyout open top position
        var $openAnchor = $flyout.find(".n-flyout-open");
        var openHeight = $openAnchor.outerHeight();
        $openAnchor.css("left", (menuWidth + 1) + "px");
        $openAnchor.css("top", Math.ceil((menuHeight - openHeight) / 2) + "px");
        // hide container
        $menuContainer.hide();
    }
});

+function () {
    $(".n-flyout").on("click", ".n-flyout-open", function () {
        var $flyoutContainer = $(this).prev(".n-flyout-container");
        if ($flyoutContainer.is(":visible")) {
            hideFlyout($flyoutContainer);
        }
        else {
            showFlyout($flyoutContainer);
        }
    });

    $(document).keyup(function (e) {
        // click esc to hide flyout menu if it is open
        var $flyoutContainer = $(".n-flyout>.n-flyout-container");
        if (e.keyCode == 27 && $flyoutContainer.is(":visible")) {
            hideFlyout($flyoutContainer);
        }
    });

    function hideFlyout($flyoutContainer) {
        var menuWidth = $flyoutContainer.outerWidth();
        $flyoutContainer.parent(".n-flyout").animate({left: -menuWidth}, 400, function () {
                $flyoutContainer.hide();
            }
        );
    }

    function showFlyout($flyoutContainer) {
        $flyoutContainer.show();
        $flyoutContainer.parent(".n-flyout").animate({left: 0}, 400);
    }
}();


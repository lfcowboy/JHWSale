/**
 * Created by linaqiu on 2015/7/20.
 */
$.fn.extend({
    initWizard: function () {
        $(this).bootstrapWizard({
            'nextSelector': '.button-next', 'previousSelector': '.button-previous',
            'firstSelector': '.button-first', 'lastSelector': '.button-last'
        });

        // init steps width
        var $steps = $(this).find(".navbar-inner>ul>li");
        var distance = Math.floor(100 / ($steps.length - 1));
        var remainder = Math.ceil(40 / ($steps.length - 1));
        $steps.not(":last-child").css("width", "calc(" + distance + "% - " + remainder + "px)");
    }
});

(function () {
    $(".n-dl-wizard").on("click", ".modal-footer>input[type=button]", function () {
        var activeTab = $(this).closest(".modal-footer").prev(".modal-body").find("li.active");
        addPassStyle(activeTab);
    });

    $(".n-dl-wizard").on("click", '[data-toggle="tab"]', function () {
        addPassStyle($(this).parent("li"));
    });

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function () {
        var $wizard = $(".n-dl-wizard.in");
        if ($wizard.length > 0) {
            // set next button as focus and reset to the first step
            $wizard.find("input[type=button][name=next]").focus();
            $wizard.find("input[type=button][name=first]").trigger("click");
        }
    });

    function addPassStyle(activeTab){
        activeTab.removeClass("passed").siblings("li").removeClass("passed");
        var $passedSteps = activeTab.prevAll("li");
        if ($passedSteps.length > 0) {
            $passedSteps.addClass("passed");
        }
    }

}());
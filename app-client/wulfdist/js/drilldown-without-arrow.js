+function () {

    function setLastRowBorderRadius(currentRow,lastRow,value)
    {
        if (currentRow.attr("row-target-selector") == lastRow.attr("row-target-selector")) {
            currentRow.css("border-bottom-left-radius", value);
            currentRow.css("border-bottom-right-radius", value);
        }
    }

    var obj;
    $(".n-drillDown-row").each(function (i) {
        $(this).bind('click', function () {
            if (obj == this) {
                $($(this).attr("row-target-selector")).slideUp();
                $(this).removeClass("n-drillDown-border-row");
                setLastRowBorderRadius($(this),$($(".n-drillDown-row").get($(".n-drillDown-row").length - 1)),"5px");
                obj = '';
            }
            else {
                if (obj && $(obj).attr("class").indexOf("n-drillDown-border-row") > 0) {
                    $(obj).removeClass("n-drillDown-border-row");
                    $($(".n-drillDown-row").get($(".n-drillDown-row").length - 1)).css("border-bottom-left-radius", "5px");
                    $($(".n-drillDown-row").get($(".n-drillDown-row").length - 1)).css("border-bottom-right-radius", "5px");
                }
                $(".n-drillDown-collapsed-row").hide();
                $($(this).attr("row-target-selector")).slideDown();
                $(this).addClass("n-drillDown-border-row");
                setLastRowBorderRadius($(this),$($(".n-drillDown-row").get($(".n-drillDown-row").length - 1)),"0px");
                obj = this;
            }
        });
    });

    $(".n-drillDown-collapsed-row .icon-close-rounded").click(function () {
        $(".n-drillDown-collapsed-row").slideUp();
        $(obj).removeClass("n-drillDown-border-row");
        setLastRowBorderRadius($(obj),$($(".n-drillDown-row").get($(".n-drillDown-row").length - 1)),"5px");
        obj = '';
    });

    $(document).keyup(function (event) {
        if ($(obj).length === 0) {
            return;
        }
        if (event.keyCode === 27) {
            $(".n-drillDown-collapsed-row").slideUp();
            $(obj).removeClass("n-drillDown-border-row");
            setLastRowBorderRadius($(obj),$($(".n-drillDown-row").get($(".n-drillDown-row").length - 1)),"5px");
            obj = '';
        }
    });
}();
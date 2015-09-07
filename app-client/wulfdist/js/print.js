/**
 * Created by xiaopcao on 9/6/2015.
 */
+function () {
    var setRangesliderHandle = function (sliderValue, maxValue) {
        if (sliderValue == maxValue) {
            var handlePostion = $(".rangeslider").width() / maxValue * sliderValue - 10 + "px";
        } else {
            var handlePostion = $(".rangeslider").width() / maxValue * sliderValue + "px"
        }
        $(".rangeslider__handle").css("left", handlePostion);
    }

    var beforePrintFunc = function () {
        var maxValue = $('.n-slider').attr("max");
        var sliderValue = $('.n-slider').val();
        console.log($(".rangeslider").width());
        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        if (is_chrome) {
            setRangesliderHandle(sliderValue, maxValue);
        }
        else {
           //hardcode slider length when printing
            var sliderLength=650;
            $(".rangeslider").css("width", sliderLength);
            setRangesliderHandle(sliderValue, maxValue);
        }

    }

    var afterPrintFunc = function () {
        var maxValue = $('.n-slider').attr("max");
        var sliderValue = $('.n-slider').val();
        $(".rangeslider").css("width", "100%");
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (!is_firefox) {
            setRangesliderHandle(sliderValue, maxValue);
        }
    }


//for chrome
    window.matchMedia('print').addListener(function () {
        beforePrintFunc();
    });

    window.onbeforeprint = beforePrintFunc;
    window.onafterprint = afterPrintFunc;
}();
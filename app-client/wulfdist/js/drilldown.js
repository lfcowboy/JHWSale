+function () {
    var isShow=0;
    var obj;
    $(".n-drillDown-item").each(function(i){
        $(this).bind('click',function(){
            if(obj==this){
                $($(this).attr("data-target-selector")).slideUp();
                $(this).removeClass('n-drillDown-border');
                obj='';
                isShow=0;
            }
            else{
                var arrowDistance=$(this).position().left+$(this).width()/2;
                var arrowDistancePxValue=arrowDistance+"px";

                if(isShow && $(this).offset().top===$(obj).offset().top){ //
                    $(this).addClass('n-drillDown-border').siblings().removeClass('n-drillDown-border');
                    $(".n-drillDown-arrow").animate({left:arrowDistancePxValue});
                    $($(this).attr("data-target-selector")).show().siblings().stop(true,true).hide();
                    obj=this;
                }else{
                    $(".n-drillDown-collapsed").hide();
                    $(".n-drillDown-item").removeClass("n-drillDown-border");
                    $(this).addClass('n-drillDown-border');
                    $(".n-drillDown-arrow").css("left",arrowDistancePxValue);
                    $($(this).attr("data-target-selector")).slideDown();
                    isShow=1;
                    obj=this;
                }
            }
        });
    });

    $(".icon-close-rounded").click(function(){
        $(".n-drillDown-collapsed").slideUp();
        $(".n-drillDown-item").removeClass('n-drillDown-border');
        obj='';
        isShow=0;
    });

    $(window).resize(function(){
        if ($(obj).length ===0){
            return;
        }
        var arrowDistance=$(obj).position().left+$(obj).width()/2;
        var arrowDistancePxValue=arrowDistance+"px";
        $(".n-drillDown-arrow").css("left",arrowDistancePxValue);
    });
}();
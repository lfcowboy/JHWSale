/**
 * Created by jilian on 8/12/2015.
 */
(function(){
    $(document).ready(function(){
        $(".input-required input").on("keyup",function(event){
            var inputValue = event.target.value;
            var mandatoryElement = $(event.target).next(".form-control-feedback").find(".icon");

            if(inputValue.length>0){
                mandatoryElement.removeClass("icon-mandatory");
            }else{
                mandatoryElement.addClass("icon-mandatory");
            }
        });
    });
}());
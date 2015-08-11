 var roundCornerOfDateInput = function (selector){
    $(document).on('click.bs.dropdown.data-api', function () {
        $(selector+ " .fuelux .n-calendar .form-control").css("border-bottom-left-radius",'7pt');
    });

    $(document).ready(function () {
        $(".fuelux .n-calendar .form-control").off('focus.fu.datepicker');

        $(".fuelux .n-calendar .form-control").click(function(){
            if (!$('.fuelux .n-calendar .input-group-btn').is(".open")) {
                $(selector + " .fuelux .n-calendar .form-control").css("border-bottom-left-radius",'7pt');
            }
        });

        $(".fuelux .n-calendar .form-control").blur(function () {
            if (!$('.fuelux .n-calendar .input-group-btn').is(".open")) {
                $(selector + " .fuelux .n-calendar .form-control").css("border-bottom-left-radius", '7pt');
                $(".fuelux .n-calendar .dropdown-toggle").attr("aria-expanded", 'false');
            }
        });

        $(selector +" .fuelux .n-calendar .dropdown-toggle").click(function(){
            $(" .fuelux .n-calendar .form-control").css("border-bottom-left-radius",'7pt');
            $(selector + " .fuelux .n-calendar .form-control").css("border-bottom-left-radius",0);
            $(' .fuelux .n-calendar .open').prev().css("border-bottom-left-radius",'7pt')
        });

        $(".fuelux .datepicker-wheels-year").keydown(function (e) {
            if (e.keyCode == 40) {
                $(selector + " .fuelux .datepicker-wheels-footer .datepicker-wheels-back")[0].focus();
            }
        });

        $(".fuelux .datepicker-wheels-month").keydown(function (e) {
            if (e.keyCode == 40) {
                $(selector + " .fuelux .datepicker-wheels-footer .datepicker-wheels-back")[0].focus();
            }
        });

        $(".fuelux .datepicker-wheels-footer .datepicker-wheels-back").click(function () {
            $(selector + " .fuelux .datepicker-calendar-header .title")[0].focus();
        });

        $(".fuelux .datepicker-wheels-footer .datepicker-wheels-select").click(function () {
            $(selector + " .fuelux .datepicker-calendar-header .title")[0].focus();
        });
    });
}



function invokeCalendar(selector) {
    $(selector).append("<div class=\"datepicker fuelux\"><div class=\"input-group n-calendar\">        <input class=\"form-control\"  type=\"text\"/>        <div class=\"input-group-btn\">            <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">                <span class=\"glyphicon glyphicon-calendar\"></span>                <span class=\"sr-only\">Toggle Calendar</span>            </button>            <div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">                <div class=\"datepicker-calendar\">                    <div class=\"datepicker-calendar-header\">                        <button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button>                        <button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button>                        <button type=\"button\" class=\"title\">              <span class=\"month\">                <span data-month=\"0\">January</span>                <span data-month=\"1\">February</span>                <span data-month=\"2\">March</span>                <span data-month=\"3\">April</span>                <span data-month=\"4\">May</span>                <span data-month=\"5\">June</span>                <span data-month=\"6\">July</span>                <span data-month=\"7\">August</span>                <span data-month=\"8\">September</span>                <span data-month=\"9\">October</span>                <span data-month=\"10\">November</span>                <span data-month=\"11\">December</span>              </span> <span class=\"year\"></span>                        </button>                    </div>                    <table class=\"datepicker-calendar-days\">                        <thead>                        <tr>                            <th>SUN</th>                            <th>MON</th>                            <th>TUE</th>                            <th>WED</th>                            <th>THU</th>                            <th>FRI</th>                            <th>SAT</th>                        </tr>                        </thead>                        <tbody></tbody>                    </table>                </div>                <div class=\"datepicker-wheels\" aria-hidden=\"true\">                    <div class=\"datepicker-wheels-month\">                        <h2 class=\"header\">Month</h2>                        <ul>                            <li data-month=\"0\"><button type=\"button\">Jan</button></li>                            <li data-month=\"1\"><button type=\"button\">Feb</button></li>                            <li data-month=\"2\"><button type=\"button\">Mar</button></li>                            <li data-month=\"3\"><button type=\"button\">Apr</button></li>                            <li data-month=\"4\"><button type=\"button\">May</button></li>                            <li data-month=\"5\"><button type=\"button\">Jun</button></li>                            <li data-month=\"6\"><button type=\"button\">Jul</button></li>                            <li data-month=\"7\"><button type=\"button\">Aug</button></li>                            <li data-month=\"8\"><button type=\"button\">Sep</button></li>                            <li data-month=\"9\"><button type=\"button\">Oct</button></li>                            <li data-month=\"10\"><button type=\"button\">Nov</button></li>                            <li data-month=\"11\"><button type=\"button\">Dec</button></li>                        </ul>                    </div>                    <div class=\"datepicker-wheels-year\">                        <h2 class=\"header\">Year</h2>                        <ul></ul>                    </div>                    <div class=\"datepicker-wheels-footer clearfix\">                        <button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"glyphicon glyphicon-arrow-left\"></span><span class=\"sr-only\">Return to Calendar</span></button>                        <button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button>                    </div>                </div>            </div>        </div> </div></div>");

    roundCornerOfDateInput(selector);
}
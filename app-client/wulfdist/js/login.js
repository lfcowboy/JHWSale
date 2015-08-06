/**
 * Created by linaqiu on 2015/7/28.
 */
+function () {
    var $username = $('#applicationLoginUsername'),
        $password = $('#applicationLoginPassword'),
        $login = $('#applicationLoginButton'),
        $errorMsg = $("#error-msg");
    $errorMsg.hide();

    initLogin();

    function initLogin() {
        var $login = $(".n-login");
        var height = $login.outerHeight();
        $login.css("margin-top", -(Math.round(height / 2)) + "px");
    }

    //$login.click(function () {
    //    if ($errorMsg.is(":hidden")) {
    //        $errorMsg.show();
    //    } else {
    //        $errorMsg.hide();
    //    }
    //    return false;
    //});

    $('#applicationLoginUsername,#applicationLoginPassword').on('keyup change', function (e) {
        if ($username.val() && $password.val()) {
            $login.prop('disabled', false);
        }
        else {
            $login.prop('disabled', true);
        }
    });
    $('#applicationLoginUsername').on('keyup change', function (e) {
        if ($username.val()) {
            $username.next().children('span').removeClass('icon-mandatory');
        }
        else {
            $username.next().children('span').addClass('icon-mandatory');
        }
    });
    $('#applicationLoginPassword').on('keyup change', function (e) {
        if ($password.val()) {
            $password.next().children('span').removeClass('icon-mandatory');
        }
        else {
            $password.next().children('span').addClass('icon-mandatory');
        }
    });
}();
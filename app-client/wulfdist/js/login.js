/**
 * Created by linaqiu on 2015/7/28.
 */
(function () {
    var $username = $('#applicationLoginUsername'),
        $password = $('#applicationLoginPassword'),
        $login = $('#applicationLoginButton');

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

    $('.n-login-forget-password').on('click', ">a", function () {
        $(this).removeClass("n-link-visited").addClass("n-link-visited");
    });
}());
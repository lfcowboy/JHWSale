/**
 * Created by linaqiu on 2015/6/3.
 */
(function () {
    $(document).on('click.bs.dropdown.data-api', '[data-toggle="dropdown"]', function () {
        if ($(this).parents(".combobox").length !== 0) {
            $(this).parents(".combobox").toggleClass('combobox-open');
        }
    });

    $(document).on('click.bs.dropdown.data-api', function () {
        if ($(".combobox-open").length !== 0) {
            $(".combobox-open").removeClass('combobox-open');
        }
    });
}());


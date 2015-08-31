/**
 * Created by zuhe on 7/23/2015.
 */
// process the leaf check box click events
$('.tree').on("click", "li.tree-item .checkbox[name='file']", function () {
    var currentStatus = $(this).find("input").prop("checked");
    var targetStatus = !currentStatus;
    $(this).find("input").prop("checked", targetStatus);
    updateTree();
});

// process the folder check box click events
$('.tree').on("click", "li.tree-branch .checkbox[name='folder']", function () {
    var currentStatus = $(this).find("input").prop("checked");
    var targetStatus = !currentStatus;
    $(this).find("input").prop({
        "checked": targetStatus,
        indeterminate: false
    });
    var arrChk = $(this).closest(".tree-branch").find("input");
    arrChk.each(function () {
        $(this).prop({
            "checked": targetStatus,
            indeterminate: false
        });
    });
    updateTree();
});

$('.tree').on('click.fu.tree', ".tree-branch .checkbox[name='folder']", $.proxy(function (ev) {
    this.preventDefault();
}, this));

function updateTree() {
    $(".tree-branch-name > .checkbox > input[name='folder']").each(function () {
        var statuses = [];
        $(this).closest(".tree-branch").find("input[name='file']").each(
            function () {
                statuses.push($(this).prop("checked"));
            }
        );
        if (statuses.length !== 0) {
            var allfileschecked = statuses.reduce(function (a, b) {
                return a && b;
            });
            var partfilechecked = statuses.reduce(function (a, b) {
                return a || b;
            });
            $(this).prop("checked", allfileschecked);
            if (allfileschecked) {
                $(this).prop({
                    "checked": true,
                    indeterminate: false
                });
            }
            else if (partfilechecked) {
                $(this).prop({
                    "checked": false,
                    indeterminate: true
                });
            }
            else {
                $(this).prop({
                    "checked": false,
                    indeterminate: false
                });
            }
        }
    });
}
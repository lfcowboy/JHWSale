/**
 * Created by fenglv on 2015/8/9.
 */
var showConfirmMsg  = function(headMsg, confirmMsg){
    $('#confirmHead').html(headMsg);
    $('#confirmMsg').html(confirmMsg);
    $("#ConfirmationDialog").modal('show');
}

var showErrorMsg  = function(errorHead, errorMsg){
    $('#errorHead').html(errorHead);
    $('#errorMsg').html(errorMsg);
    $("#errorDialog").modal('show');
}
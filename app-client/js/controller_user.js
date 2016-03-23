/**
 * Created by fenglv on 2016/3/10.
 */
var initAddUserDialog = function(userId){
    addInputValidation();
    var isAdd = !userId && userId != 0;

    var mandatoryValidation =  function(){
        var addAccountButton = $('#addAccountButton');
        addAccountButton.prop( 'disabled', false );

        mandatoryIconControl($('#addAccount_name'), addAccountButton);

        if(isAdd){
            mandatoryIconControl($('#addAccount_account'), addAccountButton);
            mandatoryIconControl($('#addAccount_password'), addAccountButton);
            mandatoryIconControl($('#addAccount_passwordConfirm'), addAccountButton);
        }
    }

    mandatoryValidation();

    if(!isAdd){
        $('#addAccount_account').prop( 'readonly', true );
        $('#addAccount_account').addClass( 'n-inputfield-uneditable' );
    }

    $( '#addAccount_account,#addAccount_name,#addAccount_password,#addAccount_passwordConfirm').on( 'keyup change', function( e ) {
        mandatoryValidation();
    } );

    $("#addAccountButton").click(function () {

        if(isAdd && $('#addAccount_passwordConfirm').val() != $('#addAccount_password').val()){
            $("#addAccount_msg").html('两次密码输入不一致，请重新输入!');
            $("#addAccount_msgBox").show();
            return false;
        }

        var params = {
            account: $('#addAccount_account').val(),
            name: $('#addAccount_name').val(),
            tel: $('#addAccount_tel').val(),
            email: $('#addAccount_email').val()
        };
        var url = '/updateUser';
        if(isAdd){
            params.password = $('#addAccount_password').val();
            url = '/addUser';
        }

        $.ajax({
            data: params,
            url: url,
            type: 'post',
            dataType: 'json',
            cache: false,
            timeout: 5000,
            success: function (data) {
                if (data.success) {
                    if(!isAdd) {
                        $('#userName').html($('#addAccount_name').val());
                    }
                    showSuccess(data.msg);
                    $('#addUserDialog').modal('hide');
                    //dataAdapter.dataBind();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showErrorMsgDefault();
            }
        });
    });
}
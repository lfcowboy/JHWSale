/**
 * Created by fenglv on 2016/3/10.
 */
var initAddUserDialog = function(userId){
    var isAdd = !userId && userId != 0;

    var mandatoryValidation =  function(){
        $('#addAccountButton').prop( 'disabled', false );

        var name = $('#addAccount_name').val();
        if(!name){
            $('#addAccountButton').prop( 'disabled', true );
            $('#addAccount_name').next().children( 'span' ).addClass( 'icon-mandatory' );
        }else{
            $('#addAccount_name').next().children( 'span' ).removeClass( 'icon-mandatory' );
        }

        if(isAdd){
            var account = $('#addAccount_account').val();
            if(!account){
                $('#addAccountButton').prop( 'disabled', true );
                $('#addAccount_account').next().children( 'span' ).addClass( 'icon-mandatory' );
            }else{
                $('#addAccount_account').next().children( 'span' ).removeClass( 'icon-mandatory' );
            }

            var password = $('#addAccount_password').val();
            if(!password){
                $('#addAccountButton').prop( 'disabled', true );
                $('#addAccount_password').next().children( 'span' ).addClass( 'icon-mandatory' );
            }else{
                $('#addAccount_password').next().children( 'span' ).removeClass( 'icon-mandatory' );
            }

            var passwordConfirm = $('#addAccount_passwordConfirm').val();
            if(!passwordConfirm){
                $('#addAccountButton').prop( 'disabled', true );
                $('#addAccount_passwordConfirm').next().children( 'span' ).addClass( 'icon-mandatory' );
            }else{
                $('#addAccount_passwordConfirm').next().children( 'span' ).removeClass( 'icon-mandatory' );
            }
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
            alert('两次密码输入不一致，请重新输入!');
            //$("#addAccount_msg").show();
            return false;
        }

        var params = {
            account: $('#addAccount_account').val(),
            name: $('#addAccount_name').val()
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
                    $('#userName').html($('#addAccount_name').val());
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
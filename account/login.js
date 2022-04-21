$(document).ready(function() {
    $('#login-form').submit(function(event) {
        event.preventDefault();
        
        var email = $(this).find('#login-email').val();
        var password = $(this).find('#login-password').val();
        var remember = $(this).find('#login-remember').prop('checked');
        
        if(!email.length || !password.length) {
            msgBox('Fill the form correctly');
            return;
        }
    
        $.ajax({
            url: config.apiUrl + '/account/login',
            type: 'POST',
            data: JSON.stringify({
                email: email,
                password: password,
                remember: remember
            }),
            contentType: "application/json",
            dataType: "json"
        })
        .done(function (data) {
            if(data.success) {
                sessionStorage.setItem('apiKey', data.api_key);
                sessionStorage.setItem('userName', email);
            
                if(remember) {
                    localStorage.setItem('_apiKey', data.api_key);
                    localStorage.setItem('_userName', email);
                }
            
                var redirectUrl = '/';
                var urlParams = new URLSearchParams(window.location.search);
                var back = urlParams.get('back');
                if(back != null) {
                    redirectUrl = window.location.origin + back;
                }
                window.location.replace(redirectUrl);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn();
        });
    });
    
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');    
});
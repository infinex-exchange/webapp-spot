function internalLogOut() {
    window.apiKey = null;
    window.loggedIn = false;
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('apiKey');
    localStorage.removeItem('_userName');
    localStorage.removeItem('_apiKey');
}

function logOut() {
    internalLogOut();
    window.location.replace('/account/login');
}

function gotoLogin() {
    window.location.replace('/account/login?back=' + encodeURI(window.location.pathname));
}

$(document).ready(function() {
    // Auto login localStorage to sessionStorage
    if(sessionStorage.getItem("apiKey") === null) {
        if(localStorage.getItem("_apiKey") === null) {
            // Not logged in
            window.loggedIn = false;
            $(document).trigger('authChecked');
            return;
        }
        sessionStorage.setItem('apiKey', localStorage.getItem('_apiKey'));
        sessionStorage.setItem('userName', localStorage.getItem('_userName'));
    };
    
    // Check is session alive, unset lS and sS when not
    $.ajax({
        url: config.apiUrl + '/account/session_check',
        type: 'POST',
        data: JSON.stringify({
            api_key: sessionStorage.getItem("apiKey")
        }),
        contentType: "application/json",
        dataType: "json",
        async: false
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            window.apiKey = sessionStorage.getItem("apiKey");
            window.userName = sessionStorage.getItem("userName");
            window.loggedIn = true;
        } else {
            // Logout now
            internalLogOut();
        }
        
        $(document).trigger('authChecked');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
});

$(document).onFirst('authChecked', function() {
    window.multiEvents['authChecked'] = true;
    
    if(window.loggedIn) {
        $('.guest-only').hide();
        $('.user-only').show();
        if($('#root').hasClass('guest-only'))
            msgBoxUnauthorized();
    } else {
        $('.guest-only').show();
        $('.user-only').hide();
        if($('#root').hasClass('user-only'))
            msgBoxUnauthorized();
    }
});
$(document).ready(function() {
    $('#btn-statusbar-fees').on('click', function() {
        if(window.loggedIn) {
            $.ajax({
                url: config.apiUrl + '/spot/user_fees',
                type: 'POST',
                data: JSON.stringify({
                    api_key: window.apiKey
                }),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(data.success) {
                    $('#mf-level').html(data.level);
                    $('#mf-maker').html(data.maker_fee);
                    $('#mf-taker').html(data.taker_fee);
                    $('#modal-fees').modal('show');
                }
                else {
                    msgBox(data.error);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                msgBoxNoConn(false);
            });
        }
        
        else {
            window.open('/info/fees','_blank');
        }
    });    
});
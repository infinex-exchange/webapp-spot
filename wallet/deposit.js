$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('#select-coin').on('change', function() {
        $('#deposit-step3').hide();
        initSelectNet( $('#select-coin').val() );
        $('#deposit-step2').show();
    });
    
    $('#select-net').on('change', function() {
        $('#deposit-step3').hide();
        
        var di = window.depositInfo[$(this).attr('data-network')];
        $('#deposit-addr').html(di.address);
        window.qrcode.clear();
        window.qrcode.makeCode(di.address);
        
        $('#deposit-step3').show();
        $('html, body').animate({
            scrollTop: $("#deposit-step3").offset().top
        }, 1000);
    });
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        window.qrcode = new QRCode("deposit-qrcode", {
            correctLevel : QRCode.CorrectLevel.H
        });
    
        var rtxData = {
            api_key: window.apiKey,
            type: 'DEPOSIT',
        };
        
        var pathArray = window.location.pathname.split('/');
        var pathLast = pathArray[pathArray.length - 1];
        if(pathLast != 'deposit' && pathLast != '') {
            var symbol = pathLast.toUpperCase();
            $.ajax({
                url: config.apiUrl + '/wallet/assets',
                type: 'POST',
                data: JSON.stringify({
                    symbols: [symbol]
                }),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(data.success) {
                    $('#select-coin').val(symbol);
                    $('#select-coin').trigger('change');
                    rtxData.asset = symbol;
                } else {
                    msgBox(data.error);
                }
                $(document).trigger('renderingStage');
                initRecentTx(rtxData);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                msgBoxNoConn(false);
                $(document).trigger('renderingStage');
                initRecentTx(rtxData);
            });
        } else {
            $(document).trigger('renderingStage');
            initRecentTx(rtxData);
        }
    }
});
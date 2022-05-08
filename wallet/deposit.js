$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('#select-coin').on('change', function() {
        $('#deposit-step2').hide();
        $('#deposit-step3').hide();
        initSelectNet( $('#select-coin').val() );
    });
    
    $('#select-net').on('dataLoaded', function() {
        $('#deposit-step2').show();
    });
    
    $('#select-net').on('change', function() {
        $('#deposit-step3').hide();
        
        $.ajax({
            url: config.apiUrl + '/wallet/deposit',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                asset: $('#select-coin').val(),
                network: $('#select-net').data('network')
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                // Operating warning
                if(data.operating)
                    $('#deposit-operating-warning').addClass('d-none');
                else
                    $('#deposit-operating-warning').removeClass('d-none');
                
                // Confirms target
                $('#deposit-confirmations').html(data.confirms_target);
                
                // Address
                $('#deposit-addr').html(data.address);
                
                // QR
                if(typeof(data.qr_content) !== 'undefined') {
                    window.qrcode.clear();
                    window.qrcode.makeCode(data.qr_content);
                    $('#deposit-qr-wrapper').removeClass('d-none');
                }
                else
                    $('#deposit-qr-wrapper').addClass('d-none');
                
                // Memo
                if(typeof(data.memo_name) !== 'undefined' && typeof(data.memo) !== 'undefined') {
                    $('#deposit-memo-name').html(data.memo_name);
                    $('#deposit-memo').html(data.memo);
                    $('#deposit-memo-wrapper').removeClass('d-none');
                }
                else
                    $('#deposit-memo-wrapper').addClass('d-none');
        
                $('#deposit-step3').show();
                $('html, body').animate({
                    scrollTop: $("#deposit-step3").offset().top
                }, 1000);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });
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
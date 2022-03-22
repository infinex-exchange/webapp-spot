$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('#select-coin').on('change', function() {
        $('#deposit-step2').hide();
        $('#deposit-step3').hide();
        var asset = $('#select-coin').val();
        $.ajax({
            url: config.apiUrl + '/wallet/deposit',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                asset: asset
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                window.recentTxAS.data.asset = asset;
                window.recentTxAS.reset();
                
                window.depositInfo = data.deposit;
                $('#select-net').val('');
                $('#select-net').attr('data-network', '');
                $('#select-net-data').html('');
                $.each(data.deposit, function(k, v) {
                    $('#select-net-data').append(`
                        <div class="select-net-item row p-1 hoverable" data-network="${k}" data-description="${v.description}">
                            <div class="col-auto my-auto text-center" style="width: 32px">
                                <img width="24px" height="24px" src="${v.icon_url}">
                            </div>
                            <div class="col my-auto">
                                ${v.description}
                            </div>
                        </div>
                    `);
                });
                $('#select-net').trigger('dataReady');
                $('.select-net-item').on('click', function() {
                    $('#select-net').val($(this).attr('data-description'));
                    $('#select-net').attr('data-network', $(this).attr('data-network'));
                    $('#select-net').trigger('change');
                });
                $('#deposit-step2').show();
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });
    });
    
    $('#select-net').on('change', function() {
        $('#deposit-step3').hide();
        var di = window.depositInfo[$(this).attr('data-network')];
        $('#deposit-addr').html(di.address);
        window.qrcode.clear();
        window.qrcode.makeCode(di.address);
        $('#deposit-step3').show();
    });
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        window.qrcode = new QRCode("deposit-qrcode", {
            width: 128,
            height: 128,
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
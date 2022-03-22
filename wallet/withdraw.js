$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('#select-coin').on('change', function() {
        $('#withdraw-step2').hide();
        $('#withdraw-step3').hide();
        var asset = $('#select-coin').val();
        $.ajax({
            url: config.apiUrl + '/wallet/withdraw/networks',
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
                
                $('#select-net').val('');
                $('#select-net').attr('data-network', '');
                $('#select-net-data').html('');
                $.each(data.networks, function(k, v) {
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
                $('.select-net-item').on('click', function() {
                    $('#select-net').val($(this).attr('data-description'));
                    $('#select-net').attr('data-network', $(this).attr('data-network'));
                    $('#select-net').trigger('change');
                });
                $('#withdraw-step2').show();
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });
    });
    
    $('#select-net').on('change', function() {        
        $('#withdraw-step3').show();
    });
    
    $('#withdraw-address').on('input', function() {
        if(typeof(window.addrTypingTimeout) !== 'undefined')
            clearTimeout(window.addrTypingTimeout);
        window.addrTypingTimeout = setTimeout(function() {
            
            $.ajax({
                url: config.apiUrl + '/wallet/withdraw/validate',
                type: 'POST',
                data: JSON.stringify({
                    api_key: window.apiKey,
                    asset: $('#select-coin').val(),
                    network: $('#select-net').attr('data-network'),
                    address: $('#withdraw-address').val()
                }),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(!data.success) {
                    msgBox(data.error);
                }
                else if(!data.valid) {
                    $('#help-address').show();
                }
                else {
                    $('#help-address').hide();
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                msgBoxNoConn(false);
            });
            
        }, 750);
    });
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        var rtxData = {
            api_key: window.apiKey,
            type: 'WITHDRAWAL',
        };
        
        var pathArray = window.location.pathname.split('/');
        var pathLast = pathArray[pathArray.length - 1];
        if(pathLast != 'withdraw' && pathLast != '') {
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
$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('#select-coin').on('change', function() {
        $('#withdraw-step2').hide();
        $('#withdraw-step3').hide();
        initSelectNet( $('#select-coin').val() );
    });
    
    $('#select-net').on('dataLoaded', function() {
        $('#withdraw-step2').show();
    });
    
    $('#withdraw-fee-range').on('input', function() {
        $('#withdraw-fee').val($(this).val());
    });
    
    $('#select-net').on('change', function() {        
        $('#withdraw-step3').hide();
        
        $.ajax({
            url: config.apiUrl + '/wallet/withdraw/info',
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
                    $('#withdraw-operating-warning').addClass('d-none');
                else
                    $('#withdraw-operating-warning').removeClass('d-none');
                
                // Min and max fee
                var feeStep = '0.';
                for(var i = 0; i < data.prec - 1; i++)
                    feeStep += '0';
                feeStep += '1';
                
                $('#withdraw-fee-range').attr('min', data.fee_min)
                                        .attr('max', data.fee_max)
                                        .attr('step', feeStep)
                                        .trigger('input');
                
                // Precision
                
                // Memo
                if(typeof(data.memo_name) !== 'undefined')
                    $('#withdraw-memo-wrapper').removeClass('d-none');
                else
                    $('#withdraw-memo-wrapper').addClass('d-none');
                
                $('#withdraw-step3').show();
                $('html, body').animate({
                    scrollTop: $("#withdraw-step3").offset().top
                }, 1000);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });
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
$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    // Download balance and init net selector when coin selected
    $('#select-coin').on('change', function() {
        $('#withdraw-step2').hide();
        $('#withdraw-step3').hide();
        var asset = $('#select-coin').val();
        
         $.ajax({
            url: config.apiUrl + '/wallet/balances',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                symbols: [ asset ]
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                window.wdAvblBalance = new BigNumber(data.balances[asset].avbl);
                initSelectNet(asset);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });
    });
    
    // Show net selector when networks list downloaded
    $('#select-net').on('dataLoaded', function() {
        $('#withdraw-step2').show();
    });
    
    // Lock format and precision of amount input
    $('#withdraw-amount').on('input', function () {
        var regex = new RegExp("^[0-9]*(\\.[0-9]{0," + window.wdAmountPrec + "})?$");
        var newVal = $(this).val();
        
        // Revert bad format (real visible value)
        if (!regex.test(newVal)) {
            $(this).val( $(this).data('val') );
        }
        
        // Drop . on last position (data-val only)
        else if(newVal.slice(-1) == '.') {
            $(this).data('val', newVal.substring(0, newVal.length - 1));
        }
        
        // Change . to 0. on first position (data-val only)
        else if(newVal.startsWith('.')) {
            $(this).data('val', '0' + newVal);
        }
        
        // Save data-val when everythink ok
        else $(this).data('val', newVal);
    
        $(this).trigger('prevalidated');
    });
    
    // Move data-val to real visible value
    $('#withdraw-amount').on('focusout', function() {
        $(this).val( $(this).data('val') );
    });
    
    // Amount range -> amount input
    $('#withdraw-amount-range').on('input', function() {
        var amount = window.wdAvblBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100).
            dp(window.wdAmountPrec, BigNumber.ROUND_DOWN).
            toString();
        
        $('#withdraw-amount').data('val', amount)
                            .val(amount);
    });
    
    // Amount input -> amount range
    $('#withdraw-amount').on('prevalidated', function() {
        var amount = new BigNumber($(this).data('val'));
        var perc = amount.dividedBy(window.wdAvblBalance).multipliedBy(100).toFixed(0);
        $('#withdraw-amount-range').val(perc).trigger('_input');
    });
    
    // Drop amount to available balance
    $('#withdraw-amount').on('prevalidated', function() {
        var amount = new BigNumber($(this).data('val'));
        if(amount.gt(window.wdAvblBalance)) {
            $('#withdraw-amount').addClass('blink-red');
            setTimeout(function() {
                $('#withdraw-amount').removeClass('blink-red');
                
                var max = window.wdAvblBalance.dp(window.wdAmountPrec).toString();
                $('#withdraw-amount').data('val', max)
                                    .val(max)
                                    .trigger('prevalidated');
            }, 1000);
        }
    });
    
    // Fee range -> fee input
    $('#withdraw-fee-range').on('input', function() {
        $('#withdraw-fee').val($(this).val());
    });
    
    // Download info and show step3 when network selected
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
                var feeMinDec = new BigNumber(data.fee_min);
                var dp = feeMinDec.dp();
                var feeStep = new BigNumber(10);
                feeStep = feeStep.pow(-dp).dp(dp).toString();
                
                $('#withdraw-fee-range').attr('min', data.fee_min)
                                        .attr('max', data.fee_max)
                                        .attr('step', feeStep)
                                        .trigger('input');
                
                // Precision
                window.wdAmountPrec = data.prec;
                
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
    
    // Validate address
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
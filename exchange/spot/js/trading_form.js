function updateBalance() {
    function updateBalanceAfter() {
        if(typeof(window.balanceUpdatedFirstTime) === 'undefined') {
            window.balanceUpdatedFirstTime = true;
            $(document).trigger('renderingStage'); // 9
        }
                
        $('#form-base-balance').html(window.currentBaseBalance.toFixed() + ' ' + window.currentBase);
        $('#form-quote-balance').html(window.currentQuoteBalance.toFixed() + ' ' + window.currentQuote);
        
        $('.form-sell-range, #form-sell-submit').prop('disabled', window.currentBaseBalance.isEqualTo(0));
        $('#form-buy-range, #form-buy-submit').prop('disabled', window.currentQuoteBalance.isEqualTo(0));
    }
    
    if(window.loggedIn) {
        $.ajax({
            url: config.apiUrl + '/wallet/balances',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                symbols: [
                    window.currentBase,
                    window.currentQuote
                ]
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                window.currentBaseBalance = new BigNumber(data.balances[window.currentBase].avbl);
                window.currentQuoteBalance = new BigNumber(data.balances[window.currentQuote].avbl);
                updateBalanceAfter();
            }
            else {
                msgBoxRedirect(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(true);
        });
    }
    else {
        window.currentBaseBalance = new BigNumber(0);
        window.currentQuoteBalance = new BigNumber(0);
        updateBalanceAfter();
    }
}

function postOrder(data) {
    Object.assign(data, {
        api_key: window.apiKey,
        pair: window.currentPair
    });
    $.ajax({
        url: config.apiUrl + '/spot/open_orders/new',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(!data.success) {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function switchOrderType(type) {
    switch(type) {
        case 'LIMIT':
        case 'STOP_LIMIT':
            if(window.orderType == 'MARKET')
                $('.form-price').data('val', '').val('').prop('disabled', false);
            
            $('.switch-time-in-force[data-tif="GTC"]').show();
            switchTimeInForce('GTC');
            
            break;
        case 'MARKET':
            $('.form-price').data('val', '').val('Market').prop('disabled', true);
            
            if(window.keepOnTypeChange['BUY'] == 'amount') $('#form-buy-total').data('val', '').val('');
            else $('#form-buy-amount').data('val', '').val('');
            
            if(window.keepOnTypeChange['SELL'] == 'amount') $('#form-sell-total').data('val', '').val('');
            else $('#form-sell-amount').data('val', '').val('');
            
            switchTimeInForce('FOK');
            $('.switch-time-in-force[data-tif="GTC"]').hide();
            
            break;
    }
    
    if(type == 'STOP_LIMIT') {
        $('.form-stop').parent('div').show();
    }
    else {
        $('.form-stop').parent('div').hide();
    }
    
    window.orderType = type;
    $('.switch-order-type').removeClass('active');
    $('.switch-order-type[data-type="' + type + '"]').addClass('active');
    
    doJsSizing();
}

function switchTimeInForce(tif) {
    window.timeInForce = tif;
    $('.switch-time-in-force').removeClass('active');
    $('.switch-time-in-force[data-tif="' + tif + '"]').addClass('active');
    $('#current-tif').html(tif);
}

$(document).on('pairSelected', function() {
    // Update balance
    updateBalance();
    
    // Select default order type
    $('.switch-order-type').on('click', function() {
        switchOrderType($(this).attr('data-type'));
    });
    switchOrderType('LIMIT');
    
    // Select default time in force
    $('.switch-time-in-force').on('click', function() {
        switchTimeInForce($(this).attr('data-tif'));
    });
    
    // Suffixes
    $('.form-base-suffix').html(window.currentBase);
    $('.form-quote-suffix').html(window.currentQuote);
    
    // Lock format and precision of inputs
    $('.form-stop, .form-price, .form-amount, .form-total').on('input', function () {
        // Precision is quote, except amount in base
        var prec = window.currentQuotePrecision;
        if($(this).hasClass('form-amount'))
            prec = window.currentBasePrecision;
        
        var regex = new RegExp("^[0-9]*(\\.[0-9]{0," + prec + "})?$");
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
    $('.form-stop, .form-price, .form-amount, .form-total').on('focusout', function() {
        $(this).val( $(this).data('val') );
    });
    
    // Auto market price when price ''
    $('.form-amount, .form-total, .form-range').onFirst('input', function() {
        if(window.orderType == 'MARKET')
            return;
        
        var priceField = $('.form-price[data-side="' + $(this).data('side') + '"]');
        
        if(priceField.data('val') == '')
            priceField.data('val', window.currentMarketPrice.toFixed(window.currentQuotePrecision))
                      .val(window.currentMarketPrice.toFixed(window.currentQuotePrecision));
    });
    
    // Price and amount changes total
    $('.form-price, .form-amount').on('prevalidated', function() {
        var side = $(this).data('side');
        // If market order - empty opposite field
        var totalStr = '';
        
        // If limit order calculate
        if($(this).data('val') != '' && (window.orderType == 'LIMIT' || window.orderType == 'STOP_LIMIT')) {
            var price = new BigNumber($('.form-price[data-side="' + side + '"]').data('val'));
            var amount = new BigNumber($('.form-amount[data-side="' + side + '"]').data('val'));
        
            var total = amount.multipliedBy(price);
            totalStr = total.toFixed(window.currentQuotePrecision);
        }
        
        $('.form-total[data-side="' + side + '"]').data('val', totalStr).val(totalStr);
    });
    
    // Total changes amount
    $('.form-total').on('prevalidated', function() {
        var side = $(this).data('side');
        // If market order - empty opposite field
        var amountStr = '';
        
        if($(this).data('val') != '' && (window.orderType == 'LIMIT' || window.orderType == 'STOP_LIMIT')) {        
            var price = new BigNumber($('.form-price[data-side="' + side + '"]').data('val'));
            var total = new BigNumber($('.form-total[data-side="' + side + '"]').data('val'));
        
            var amount = total.dividedBy(price);
            amountStr = amount.toFixed(window.currentBasePrecision);
        }
        
        $('.form-amount[data-side="' + side + '"]').data('val', amountStr).val(amountStr);
    });
            
    // Slider
    $('#form-buy-range').on('input', function() {
        var buyTotal = window.currentQuoteBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100);
        
        $('#form-buy-total').data('val', buyTotal.toFixed(window.currentQuotePrecision))
                            .val(buyTotal.toFixed(window.currentQuotePrecision))
                            .trigger('prevalidated');
    });
    
    $('#form-sell-range').on('input', function() {
        var sellAmount = window.currentBaseBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100);
        
        $('#form-sell-amount').data('val', sellAmount.toFixed(window.currentBasePrecision))
                              .val(sellAmount.toFixed(window.currentBasePrecision))
                              .trigger('prevalidated');
    });
    
    // What is important for user - amount or total
    window.keepOnTypeChange = new Object();
    window.keepOnTypeChange['BUY'] = 'total';
    window.keepOnTypeChange['SELL'] = 'amount';
    
    $('.form-amount').on('prevalidated', function() {
        window.keepOnTypeChange[$(this).data('side')] = 'amount';
    });
    
    $('.form-total').on('prevalidated', function() {
        window.keepOnTypeChange[$(this).data('side')] = 'total';
    });
    
    // Submit order
    $('.form-submit').on('click', function() {
        var side = $(this).data('side');
        var data = new Object();
        
        data['side'] = side;
        data['type'] = window.orderType;
        data['time_in_force'] = window.timeInForce;
        
        switch(window.orderType) {
            case 'STOP_LIMIT':
                data['stop'] = $('.form-stop[data-side="' + side + '"]').val();
                if(data['stop'] == '') {
                    msgBox('Missing stop price');
                    return;
                }
            case 'LIMIT':
                data['price'] = $('.form-price[data-side="' + side + '"]').val();
                if(data['price'] == '') {
                    msgBox('Missing limit price');
                    return;
                }
                data['amount'] = $('.form-amount[data-side="' + side + '"]').val();
                if(data['amount'] == '') {
                    msgBox('Missing amount');
                    return;
                }
                break;
                
            case 'MARKET':
                if(window.keepOnTypeChange[side] == 'amount')
                    data['amount'] = $('.form-amount[data-side="' + side + '"]').val();
                else
                    data['total'] = $('.form-total[data-side="' + side + '"]').val();
                
                if((typeof(data['amount']) === 'undefined' || data['amount'] == '') &&
                   (typeof(data['total']) === 'undefined' || data['total'] == '')
                ) {
                    msgBox('Missing amount or total');
                    return;
                }
                
                break;
        }
        
        postOrder(data);
    });
    
    // Expand and close form for one side on mobile
    $('.form-expand-button').onFirst('click', function() {
        $('.form-inner-side').addClass('d-none');
        $('.form-inner-side[data-side="' + $(this).data('side') + '"]').removeClass('d-none');
        $('#form-compact-buttons').addClass('d-none');
        $('#form-inner').removeClass('d-none');
    });
    
    $('.form-close-button').onFirst('click', function() {
        $('#form-inner').addClass('d-none');
        $('#form-compact-buttons').removeClass('d-none');
    });
});

$(document).on('orderAccepted orderUpdate', function() {
    updateBalance();
});
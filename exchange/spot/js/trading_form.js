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
        dataType: "json"
    })
    .retry(config.retry)
    .done(function (resp) {
        if(resp.success) {
            // Reset current side of trading form
            var sideDiv = $('.form-inner-side[data-side="' + data.side + '"]');
            sideDiv.find('input[type=text]').data('val', '').val('');
            sideDiv.find('input[type=range]').val(0).trigger('_input');
            switchOrderType(data.type);
        }
        else {
            msgBox(resp.error);
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
                $('.form-price').data('rval', '').prop('disabled', false).trigger('setVal');
            
            $('.switch-time-in-force[data-tif="GTC"]').show();
            switchTimeInForce('GTC');
            
            break;
        case 'MARKET':
            $('.form-price').data('rval', '').val('Market').prop('disabled', true);
            
            if(window.keepOnTypeChange['BUY'] == 'amount')
                $('#form-buy-total').data('rval', '').trigger('setVal');
            else
                $('#form-buy-amount').data('rval', '').trigger('setVal');
            
            if(window.keepOnTypeChange['SELL'] == 'amount')
                $('#form-sell-total').data('rval', '').trigger('setVal');
            else
                $('#form-sell-amount').data('rval', '').trigger('setVal');
            
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
    
    // What is important for user - amount or total
    window.keepOnTypeChange = new Object();
    window.keepOnTypeChange['BUY'] = 'total';
    window.keepOnTypeChange['SELL'] = 'amount';
    
    
    
    
    // On: manual change stop, price, amount, total
    // Lock format and precision of inputs
    // Then trigger setImportant, update
    $('.form-stop, .form-price, .form-amount, .form-total').on('input', function () {
        // Precision is quote, except amount in base
        var prec = window.currentQuotePrecision;
        if($(this).hasClass('form-amount'))
            prec = window.currentBasePrecision;
        
        var regex = new RegExp("^[0-9]*(\\.[0-9]{0," + prec + "})?$");
        var newVal = $(this).val();
        
        // Revert bad format (visible value to typing safe value)
        if (!regex.test(newVal)) {
            $(this).val( $(this).data('tsval') );
        }
        
        else {
            // Check is real value change by calculations pending
            var haveRVal = $(this).data('rval') != $(this).data('tsval');
            
            // Drop . on last position (typing safe value only)
            if(newVal.slice(-1) == '.') {
                $(this).data('tsval', newVal.substring(0, newVal.length - 1));
            }
        
            // Change . to 0. on first position (typing safe value only)
            else if(newVal.startsWith('.')) {
                $(this).data('tsval', '0' + newVal);
            }
        
            // Save typing safe value as is when everythink ok
            else {
                $(this).data('tsval', newVal);
            }
            
            // If there is no pending change by calculations set rval also
            $(this).data('rval', newVal);
        }
    
        // Mark this field as important for user
        $(this).trigger('setImportant');
        
        // Do calculations
        $(this).trigger('updateCalc');
    });
    
    // On first: stop, price, amount, total focus out or setVal
    // Move real value to visible value and typing safe value
    $('.form-stop, .form-price, .form-amount, .form-total').onFirst('focusout setVal', function() {
        if($(this).is(':focus')) return;
        
        $(this).data('tsval', $(this).data('rval') )
               .val( $(this).data('rval') );
    });
    
    // On: buy total and sell amount focus out or setVal
    // Drop to available balance
    $('#form-buy-total').on('focusout setVal', function() {
        if($(this).is(':focus')) return;
        
        var decimalTotal = new BigNumber($(this).data('rval'));
        if(decimalTotal.gt(window.currentQuoteBalance)) {
            $('#form-buy-total, #form-quote-balance').addClass('blink-red');
            setTimeout(function() {
                $('#form-buy-total, #form-quote-balance').removeClass('blink-red');
                
                var max = window.currentQuoteBalance.toFixed(window.currentQuotePrecision, BigNumber.ROUND_DOWN);
                $('#form-buy-total').data('rval', max)
                                    .trigger('setVal')
                                    .trigger('updateCalc');
            }, 1000);
        }
    });
    
    $('#form-sell-amount').on('focusout setVal', function() {
        if($(this).is(':focus')) return;
        
        var decimalAmount = new BigNumber($(this).data('rval'));
        if(decimalAmount.gt(window.currentBaseBalance)) {
            $('#form-sell-amount, #form-base-balance').addClass('blink-red');
            setTimeout(function() {
                $('#form-sell-amount, #form-base-balance').removeClass('blink-red');
                
                var max = window.currentBaseBalance.toFixed(window.currentBasePrecision, BigNumber.ROUND_DOWN);
                $('#form-sell-amount').data('rval', max)
                                      .trigger('setVal')
                                      .trigger('updateCalc');
            }, 1000);
        }
    });
    
    // On: setImportant (triggered by manual change and slider)
    // Set what is important for user - amount or total 
    $('.form-amount').on('setImportant', function() {
        window.keepOnTypeChange[$(this).data('side')] = 'amount';
    });
    
    $('.form-total').on('setImportant', function() {
        window.keepOnTypeChange[$(this).data('side')] = 'total';
    });
    
    // On first: updateCalc stop, amount, total
    // Get market price when price ''
    $('.form-stop, .form-amount, .form-total').onFirst('updateCalc', function() {
        if(window.orderType == 'MARKET')
            return;
        
        var priceField = $('.form-price[data-side="' + $(this).data('side') + '"]');
        
        if(priceField.data('rval') == '')
            priceField.data('rval', window.currentMarketPrice.toFixed(window.currentQuotePrecision))
                      .trigger('setVal');
    });
    
    // On: updateCalc price
    // Change not important for user opposite field: amount or total
    $('.form-price').on('updateCalc', function() {
        var side = $(this).data('side');
        $('.form-' + window.keepOnTypeChange[side] + '[data-side="' + side + '"]').trigger('updateCalc');
    });
    
    // On: updateCalc amount
    // Change total
    $('.form-amount').on('updateCalc', function() {
        var side = $(this).data('side');
        var amount = new BigNumber($(this).data('rval'));
        var price = new BigNumber($('.form-price[data-side="' + side + '"]').data('rval'));
        
        // If market order - empty opposite field
        var totalStr = '';
        
        // If limit order calculate
        if(!amount.isZero() && !amount.isNaN() &&
           !price.isZero() && !price.isNaN() &&
           (window.orderType == 'LIMIT' || window.orderType == 'STOP_LIMIT'))
        {
            var total = amount.multipliedBy(price);
            totalStr = total.toFixed(window.currentQuotePrecision);
        }
        
        $('.form-total[data-side="' + side + '"]').data('rval', totalStr)
                                                  .trigger('setVal');
    });
    
    // On: updateCalc total
    // BUY: We want not to spend more than the total
    // SELL: We want to receive at least as much as the total
    // Change amount, round up
    $('.form-total').on('updateCalc', function() {
        var side = $(this).data('side');
        var total = new BigNumber($(this).data('rval'));
        var price = new BigNumber($('.form-price[data-side="' + side + '"]').data('rval'));
        
        // If market order - empty opposite field
        var amountStr = '';
        
        if(!total.isZero() && !total.isNaN() &&
           !price.isZero() && !price.isNaN() &&
           (window.orderType == 'LIMIT' || window.orderType == 'STOP_LIMIT'))
        {        
            var amount = total.dividedBy(price);
            if(side == 'BUY')
                amountStr = amount.toFixed(window.currentBasePrecision, BigNumber.ROUND_DOWN);
            else
                amountStr = amount.toFixed(window.currentBasePrecision, BigNumber.ROUND_UP);
        }
        
        $('.form-amount[data-side="' + side + '"]').data('rval', amountStr)
                                                   .trigger('setVal');
    });
            
    // On: slider input
    // Change corresponding field, then updateCalc
    $('#form-buy-range').on('input', function() {
        var buyTotal = window.currentQuoteBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100).
            toFixed(window.currentQuotePrecision, BigNumber.ROUND_DOWN);
        
        $('#form-buy-total').data('rval', buyTotal)
                            .trigger('setVal')
                            .trigger('updateCalc');
    });
    
    $('#form-sell-range').on('input', function() {
        var sellAmount = window.currentBaseBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100).
            toFixed(window.currentBasePrecision, BigNumber.ROUND_DOWN);
        
        $('#form-sell-amount').data('rval', sellAmount)
                              .trigger('setVal')
                              .trigger('updateCalc');
    });
    
    // On: setVal buy total, sell amount
    // Move value from input to slider
    $('#form-buy-total').on('setVal', function() {
        var total = new BigNumber($(this).data('rval'));
        var perc = 0;
        if(! total.isNaN())
            perc = total.dividedBy(window.currentQuoteBalance).multipliedBy(100).toFixed(0);
        $('#form-buy-range').val(perc).trigger('_input');
    });
    
    $('#form-sell-amount').on('updateCalc', function() {
        var amount = new BigNumber($(this).data('rval'));
        var perc = 0;
        if(! amount.isNaN())
            perc = amount.dividedBy(window.currentBaseBalance).multipliedBy(100).toFixed(0);
        $('#form-sell-range').val(perc).trigger('_input');
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
    
    // Swipe up down to change side
    function swipeChangeSide(event, direction, distance, duration, fingerCount, fingerData) {
        $('.form-inner-side').toggleClass('d-none');
    }
    
    $('#form-inner').swipe({
        swipeUp: swipeChangeSide,
        swipeDown: swipeChangeSide,
        swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('.switch-order-type.active').next('.switch-order-type').trigger('click');
        },
        swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('.switch-order-type.active').prev('.switch-order-type').trigger('click');
        },
        fallbackToMouseEvents: false
    });
});

$(document).on('orderAccepted orderUpdate', function() {
    updateBalance();
});

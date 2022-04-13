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
    window.orderType = type;
    $('.switch-order-type').removeClass('active');
    $('.switch-order-type[data-type="' + type + '"]').addClass('active');
    
    switch(type) {
        case 'LIMIT':
        case 'STOP_LIMIT':
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
    $('.form-price, .form-amount, .form-total').on('input', function () {
        // Precision is quote, except amount in base
        var prec = window.currentQuotePrecision;
        if($(this).hasClass('form-amount'))
            prec = window.currentBasePrecision;
        
        var regex = new RegExp("^[0-9]+(\\.[0-9]{0," + prec + "})?$");
        
        if (this.value != '' && !regex.test(this.value)) {
            $(this).val($(this).data('val'));
        } else {
            $(this).data('val', $(this).val());
        }
    
        $(this).trigger('prevalidated');
    });
    
    // "10." ->  "10"
    $('.form-price, .form-amount, .form-total').on('focusout', function() {
        if(this.value.slice(-1) == '.') {
            this.value = this.value.substring(0, this.value.length - 1);
        }
    });
    
    // Auto market price when price ''
    $('.form-amount, .form-total, .form-range').onFirst('input', function() {
        var priceField = $('.form-price[data-side="' + $(this).data('side') + '"]');
        
        if(priceField.val() == '') {
            priceField.data('val', window.currentMarketPrice.toFixed(window.currentQuotePrecision))
                      .val(window.currentMarketPrice.toFixed(window.currentQuotePrecision));
        }
    });
    
    // Price and amount changes total
    $('.form-price, .form-amount').on('prevalidated', function() {
        var side = $(this).data('side');
        // If market order - empty opposite field
        var totalStr = '';
        
        // If limit order calculate
        if(window.orderType == 'LIMIT' || window.orderType == 'STOP_LIMIT') {
            var price = new BigNumber($('.form-price[data-side="' + side + '"]').val());
            var amount = new BigNumber($('.form-amount[data-side="' + side + '"]').val());
        
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
        
        if(window.orderType == 'LIMIT' || window.orderType == 'STOP_LIMIT') {        
            var price = new BigNumber($('.form-price[data-side="' + side + '"]').val());
            var total = new BigNumber($('.form-total[data-side="' + side + '"]').val());
        
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
    $('.submit').on('click', function() {
        var side = $(this).data('side');
        var data = new Object();
        
        data['side'] = side;
        data['type'] = window.orderType;
        
        switch(window.orderType) {
            case 'LIMIT':
            case 'STOP_LIMIT':
                data['price'] = $('.form-price[data-side="' + side + '"]').val();
                data['amount'] = $('.form-amount[data-side="' + side + '"]').val();
                break;
                
            case 'MARKET':
                if(window.keepOnTypeChange[side] == 'amount')
                    data['amount'] = $('.form-amount[data-side="' + side + '"]').val();
                else
                    data['total'] = $('.form-total[data-side="' + side + '"]').val();
                break;
        }
        
        postOrder(data);
    });
});

$(document).on('orderNew orderFilled orderCanceled', function() {
    updateBalance();
});
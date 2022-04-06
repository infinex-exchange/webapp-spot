function updateBalance() {
    function updateBalanceAfter() {
        if(typeof(window.balanceUpdatedFirstTime) === 'undefined') {
            window.balanceUpdatedFirstTime = true;
            $(document).trigger('renderingStage'); // 9
        }
                
        $('#form-base-balance').html(window.currentBaseBalance.toFixed() + ' ' + window.currentBase);
        $('#form-quote-balance').html(window.currentQuoteBalance.toFixed() + ' ' + window.currentQuote);
        
        $('#form-sell-range, #form-sell-submit').prop('disabled', window.currentBaseBalance.isEqualTo(0));
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
        if(data.success) {
            // notification
            setTimeout(updateBalance, 500);
        }
        else {
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
            $('#form-buy-price, #form-sell-price').val('').prop('disabled', false);
            break;
        case 'MARKET':
            $('#form-buy-price, #form-sell-price').val('Market').prop('disabled', true);
            if(window.buyImportant == 'amount') $('#form-buy-total').val('');
            else $('#form-buy-amount').val('');
            if(window.sellImportant == 'amount') $('#form-sell-total').val('');
            else $('#form-sell-amount').val('');
            break;
    }
}

$(document).on('pairSelected', function() {
    // Update balance
    updateBalance();
    
    // Select default order type
    $('.switch-order-type').on('click', function() {
        switchOrderType($(this).attr('data-type'));
    });
    switchOrderType('LIMIT');
    
    // Suffixes
    $('.form-base-suffix').html(window.currentBase);
    $('.form-quote-suffix').html(window.currentQuote);
    
    // Precision in input boxes
    $('#form-buy-amount, #form-sell-amount').on('input', function () {
        var regex = new RegExp("^[0-9]+(\\.[0-9]{0," + window.currentBasePrecision + "})?$");
        if (!regex.test(this.value)) {
            $(this).val($(this).data('val'));
        } else {
            $(this).data('val', $(this).val());
        }
        $(this).trigger('prevalidated');
    })
    .on('focusout', function() {
        if(this.value.slice(-1) == '.') {
            this.value = this.value.substring(0, this.value.length - 1);
        }
    });
    
    $('#form-buy-price, #form-sell-price, #form-buy-total, #form-sell-total').on('input', function () {
        var regex = new RegExp("^[0-9]+(\\.[0-9]{0," + window.currentQuotePrecision + "})?$");
        if (!regex.test(this.value)) {
            $(this).val($(this).data('val'));
        } else {
            $(this).data('val', $(this).val());
        }
        $(this).trigger('prevalidated');
    })
    .on('focusout', function() {
        if(this.value.slice(-1) == '.') {
            this.value = this.value.substring(0, this.value.length - 1);
        }
    });
    
    // Auto market price
    $('#form-buy-amount, #form-buy-total, #form-buy-range').onFirst('input', function() {
        if($('#form-buy-price').val() == '') {
            $('#form-buy-price').val(
                window.currentMarketPrice.toFixed(window.currentQuotePrecision)
            );
        }
    });
    
    $('#form-sell-amount, #form-sell-total, #form-sell-range').onFirst('input', function() {
        if($('#form-sell-price').val() == '') {
            $('#form-sell-price').val(
                window.currentMarketPrice.toFixed(window.currentQuotePrecision)
            );
        }
    });
    
    // One changes another - on prevalidated 
    $('#form-buy-price, #form-buy-amount').on('prevalidated', function() {
        var buyTotalStr = '';
        
        if(window.orderType == 'LIMIT') {
            var buyPrice = new BigNumber($('#form-buy-price').val());
            var buyAmount = new BigNumber($('#form-buy-amount').val());
        
            var buyTotal = buyAmount.multipliedBy(buyPrice);
            buyTotalStr = buyTotal.toFixed(window.currentQuotePrecision);
        }
        
        $('#form-buy-total').val(buyTotalStr);
    });
    
    $('#form-buy-total').on('prevalidated', function() {
        var buyAmountStr = '';
        
        if(window.orderType == 'LIMIT') {        
            var buyPrice = new BigNumber($('#form-buy-price').val());
            var buyTotal = new BigNumber($('#form-buy-total').val());
        
            var buyAmount = buyTotal.dividedBy(buyPrice);
            buyAmountStr = buyAmount.toFixed(window.currentBasePrecision);
        }
        
        $('#form-buy-amount').val(buyAmountStr);
    });
    
    $('#form-sell-price, #form-sell-amount').on('prevalidated', function() {
        var sellTotalStr = '';
        
        if(window.orderType == 'LIMIT') {
            var sellPrice = new BigNumber($('#form-sell-price').val());
            var sellAmount = new BigNumber($('#form-sell-amount').val());
        
            var sellTotal = sellAmount.multipliedBy(sellPrice);
            sellTotalStr = sellTotal.toFixed(window.currentQuotePrecision);
        }
        
        $('#form-sell-total').val(sellTotalStr);
    });
    
    $('#form-sell-total').on('prevalidated', function() {
        var sellAmountStr = '';
        
        if(window.orderType == 'LIMIT') {
            var sellPrice = new BigNumber($('#form-sell-price').val());
            var sellTotal = new BigNumber($('#form-sell-total').val());
        
            var sellAmount = sellTotal.dividedBy(sellPrice);
            sellAmountStr = sellAmount.toFixed(window.currentBasePrecision);
        }
        
        $('#form-sell-amount').val(sellAmountStr);
    });
            
    // Slider
    $('#form-buy-range').on('input', function() {
        var buyTotal = window.currentQuoteBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100);
        
        $('#form-buy-total').val(
            buyTotal.toFixed(window.currentQuotePrecision)
        ).trigger('prevalidated');
    });
    
    $('#form-sell-range').on('input', function() {
        var sellAmount = window.currentBaseBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100);
        
        $('#form-sell-amount').val(
            sellAmount.toFixed(window.currentBasePrecision)
        ).trigger('prevalidated');
    });
    
    // What is important for user - amount or total
    window.buyImportant = 'total';
    window.sellImportant = 'amount';
    
    $('#form-buy-amount').on('prevalidated', function() {
        window.buyImportant = 'amount';
    });
    
    $('#form-buy-total').on('prevalidated', function() {
        window.buyImportant = 'total';
    });
    
    $('#form-sell-amount').on('prevalidated', function() {
        window.sellImportant = 'amount';
    });
    
    $('#form-sell-total').on('prevalidated', function() {
        window.sellImportant = 'total';
    });
    
    // Submit order
    $('#form-buy-submit').on('click', function() {
        var data = new Object();
        
        data['side'] = 'BUY';
        data['type'] = window.orderType;
        
        switch(window.orderType) {
            case 'LIMIT':
                data['price'] = $('#form-buy-price').val();
                data['amount'] = $('#form-buy-amount').val();
                break;
                
            case 'MARKET':
                if(window.buyImportant == 'amount')
                    data['amount'] = $('#form-buy-amount').val();
                else
                    data['total'] = $('#form-buy-total').val();
                break;
        }
        
        postOrder(data);
    });
    
    $('#form-sell-submit').on('click', function() {
        var data = new Object();
        
        data['side'] = 'SELL';
        data['type'] = window.orderType;
        
        switch(window.orderType) {
            case 'LIMIT':
                data['price'] = $('#form-sell-price').val();
                data['amount'] = $('#form-sell-amount').val();
                break;
                
            case 'MARKET':
                if(window.sellImportant == 'amount')
                    data['amount'] = $('#form-sell-amount').val();
                else
                    data['total'] = $('#form-sell-total').val();
                break;
        }
        
        postOrder(data);
    });
});
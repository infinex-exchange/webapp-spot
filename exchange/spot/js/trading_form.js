function updateBalance() {
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
                if(typeof(window.currentBaseBalance) === 'undefined')
                    $(document).trigger('renderingStage'); // 9
                
                window.currentBaseBalance = new BigNumber(data.balances[window.currentBase].avbl);
                window.currentQuoteBalance = new BigNumber(data.balances[window.currentQuote].avbl);
                $('#form-base-balance').html(window.currentBaseBalance.toFixed() + ' ' + window.currentBase);
                $('#form-quote-balance').html(window.currentQuoteBalance.toFixed() + ' ' + window.currentQuote);
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
        if(typeof(window.currentBaseBalance) === 'undefined')
            $(document).trigger('renderingStage'); // 9
        
        window.currentBaseBalance = new BigNumber(0);
        window.currentQuoteBalance = new BigNumber(0);
        $('#form-base-balance').html('0 ' + window.currentBase);
        $('#form-quote-balance').html('0 ' + window.currentQuote);
    }
}

$(document).on('pairSelected', function() {
    // Update balance
    updateBalance();
    
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
    
    // One changes another - on prevalidated 
    $('#form-buy-price, #form-buy-amount').on('prevalidated', function() {
        var buyPrice = new BigNumber($('#form-buy-price').val());
        var buyAmount = new BigNumber($('#form-buy-amount').val());
        
        var buyTotal = buyAmount.multipliedBy(buyPrice);
        
        $('#form-buy-total').val(
            buyTotal.toFixed(window.currentQuotePrecision)
        );
    });
    
    $('#form-buy-total').on('prevalidated', function() {
        var buyPrice = new BigNumber($('#form-buy-price').val());
        var buyTotal = new BigNumber($('#form-buy-total').val());
        
        var buyAmount = buyTotal.dividedBy(buyPrice);
        
        $('#form-buy-amount').val(
            buyAmount.toFixed(window.currentBasePrecision)
        );
    });
    
    $('#form-sell-price, #form-sell-amount').on('prevalidated', function() {
        var sellPrice = new BigNumber($('#form-sell-price').val());
        var sellAmount = new BigNumber($('#form-sell-amount').val());
        
        var sellTotal = sellAmount.multipliedBy(sellPrice);
        
        $('#form-sell-total').val(
            sellTotal.toFixed(window.currentQuotePrecision)
        );
    });
    
    $('#form-sell-total').on('prevalidated', function() {
        var sellPrice = new BigNumber($('#form-sell-price').val());
        var sellTotal = new BigNumber($('#form-sell-total').val());
        
        var sellAmount = sellTotal.dividedBy(sellPrice);
        
        $('#form-sell-amount').val(
            sellAmount.toFixed(window.currentBasePrecision)
        );
    });
            
    // Slider
    $('#form-buy-range').on('input', function() {
        // Get market price if price not set
        if($('#form-buy-price').val() == '') {
            $('#form-buy-price').val(
                window.currentMarketPrice.toFixed(window.currentQuotePrecision)
            );
        }
        
        var buyTotal = window.currentQuoteBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100);
        
        $('#form-buy-total').val(
            buyTotal.toFixed(window.currentQuotePrecision)
        ).trigger('prevalidated');
    });
    
    $('#form-sell-range').on('input', function() {
        // Get market price if price not set
        if($('#form-sell-price').val() == '') {
            $('#form-sell-price').val(
                window.currentMarketPrice.toFixed(window.currentQuotePrecision)
            );
        }
        
        var sellAmount = window.currentBaseBalance.
            multipliedBy( $(this).val() ).
            dividedBy(100);
        
        $('#form-sell-amount').val(
            sellAmount.toFixed(window.currentBasePrecision)
        ).trigger('prevalidated');
    });
});
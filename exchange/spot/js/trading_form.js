function updateBalance() {
    $.ajax({
        url: config.apiUrl + '/wallet/balances',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            query: [
                window.currentBase,
                window.currentQuote
            ]
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .done(function (data) {
        if(data.success) {
            window.currentBaseBalance = data.balances[window.currentBase];
            window.currentQuoteBalance = data.balances[window.currentQuote];
            $('#form-base-balance').html(window.currentBaseBalance + ' ' + window.currentBase);
            $('#form-quote-balance').html(window.currentQuoteBalance + ' ' + window.currentQuote);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {  
    });
}

$(document).on('pairSelected', function() {
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
    
    // Update balance
    window.currentBaseBalance = 0;
    window.currentQuoteBalance = 0;
    sessionStart();
    if(apiKey()) {
        updateBalance();
    }
    
    // One changes another - on prevalidated
    
    $('#form-buy-price').on('prevalidated', function() {
        $('#form-buy-total').val(
            parseFloat($(this).val() * $('#form-buy-amount').val())
                .toFixed(window.currentQuotePrecision)
        );
    });
    
    $('#form-buy-amount').on('prevalidated', function() {
        $('#form-buy-total').val(
            parseFloat($(this).val() * $('#form-buy-price').val())
                .toFixed(window.currentBasePrecision)
        );
    });
    
    $('#form-buy-total').on('prevalidated', function() {
        $('#form-buy-amount').val(
            parseFloat($(this).val() / $('#form-buy-price').val())
                .toFixed(window.currentBasePrecision)
        );
    });
    
    $('#form-sell-price').on('prevalidated', function() {
        $('#form-sell-total').val(
            parseFloat($(this).val() * $('#form-sell-amount').val())
                .toFixed(window.currentQuotePrecision)
        );
    });
    
    $('#form-sell-amount').on('prevalidated', function() {
        $('#form-buy-total').val(
            parseFloat($(this).val() * $('#form-sell-price').val())
                .toFixed(window.currentBasePrecision)
        );
    });
    
    $('#form-sell-total').on('prevalidated', function() {
        $('#form-sell-total').val(
            parseFloat($(this).val() / $('#form-sell-price').val())
                .toFixed(window.currentBasePrecision)
        );
    });
            
    // Slider
    $('#form-sell-range').on('input', function() {
        $('#form-sell-amount').val(
            parseFloat($(this).val() / 100 * window.currentBaseBalance)
                .toFixed(window.currentBasePrecision)
        ).trigger('prevalidated');
    });
            
    $('#form-buy-range').on('input', function() {
        $('#form-buy-total').val(
            parseFloat($(this).val() / 100 * window.currentQuoteBalance)
                .toFixed(window.currentQuotePrecision)
        ).trigger('prevalidated');
    });  
});
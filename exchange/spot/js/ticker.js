function liveTicker(data) {
    // Current market price
    window.currentMarketPrice = new BigNumber(data.price);
    
    // Document title
    document.title = data.price + ' | ' + window.currentPair + ' | Vayamos Spot';
    
    // Ticker HTML
    var priceDiv = $('.ticker-price');
    var color = 'text-hi';
    var bnCurrent = new BigNumber(data.price);
    var bnPrevious = new BigNumber(data.previous);
    var comp = bnCurrent.comparedTo(bnPrevious);
    if(comp == 1) color = 'text-green';
    else if(comp == -1) color = 'text-red';
    priceDiv.removeClass('text-hi text-green text-red');
    priceDiv.html(data.price);
    priceDiv.addClass(color);
    
    var changeDiv = $('.ticker-change');
    color = 'text-hi';
    var changeStr = data.change;
    if(data.change > 0) {
        color = 'text-green';
        changeStr = '+' + changeStr;
    }
    if(data.change < 0)
        color = 'text-red';
    changeDiv.removeClass('text-hi text-green text-red');
    changeDiv.html(changeStr + '%');
    changeDiv.addClass(color);
    
    $('.ticker-high').html(data.high);
    $('.ticker-low').html(data.low);
    $('.ticker-vol-base').html(data.vol_base);
    $('.ticker-vol-quote').html(data.vol_quote);
}

$(document).on('prePairSelected', function() {
    // Pair from URL
    
    var pathArray = window.location.pathname.split('/');
    var pathPairName = pathArray[pathArray.length - 1].replace('_', '/');
    if(pathPairName != 'spot')
        window.currentPair = pathPairName;
    else {
        window.currentPair = window.defaultPair;
        window.history.replaceState(null, document.title, '/spot/' + window.currentPair.replace('/', '_'));
    }

    // Get extended ticker
    
    $.ajax({
        url: config.apiUrl + '/spot/markets_ex',
        type: 'POST',
        data: JSON.stringify({
            pair: window.currentPair
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            var v = data.markets[0];
            
            // Global variables and event pairSelected
            window.currentBase = v.base;
            window.currentQuote = v.quote;
            window.currentBasePrecision = v.base_precision;
            window.currentQuotePrecision = v.quote_precision;
            
            // Rest of data
            liveTicker(v);
            $(document).trigger('pairSelected');
            
            // Ticker HTML
            $('.ticker-name').html(v.pair);
            $('.ticker-base-name').html(v.base_name);
            $('.ticker-base-legend').html(window.currentBase);
            $('.ticker-quote-legend').html(window.currentQuote);
            
            // Subscribe to live events
            window.wsClient.sub(
                window.currentPair + '@tickerEx',
                function(data) {
                    liveTicker(data);
                },
                function(error) {
                    msgBoxRedirect(error);
                }
            );
            
            $(document).trigger('renderingStage'); // 2
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);  
    });
});

$(document).onFirst('pairSelected', function() {
    window.multiEvents['pairSelected'] = true;
});
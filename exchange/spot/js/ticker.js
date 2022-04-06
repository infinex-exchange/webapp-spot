function liveTicker(data) {
    // Document title
    document.title = data.price + ' | ' + window.currentPair + ' | Vayamos Spot';
    
    // Ticker HTML
    $('#ticker-price').html(data.price);
    $('#ticker-change').html(data.change + '%');
    $('#ticker-change').removeClass('text-red text-green');
    if(data.change < 0) $('#ticker-change').addClass('text-red');
    if(data.change > 0) $('#ticker-change').addClass('text-green');
    $('#ticker-high').html(data.high);
    $('#ticker-low').html(data.low);
    $('#ticker-vol-base').html(data.vol_base);
    $('#ticker-vol-quote').html(data.vol_quote);
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
            var k = Object.keys(data.markets)[0];
            var v = data.markets[k];
            
            // Global variables and event pairSelected
            window.currentBase = v.base;
            window.currentQuote = v.quote;
            window.currentBasePrecision = v.base_precision;
            window.currentQuotePrecision = v.quote_precision;
            window.currentMarketPrice = new BigNumber(v.price);
            $(document).trigger('pairSelected');
            
            // Ticker HTML
            $('#ticker-name').html(k);
            $('#ticker-base-name').html(v.base_name);
            $('#ticker-base-legend').html(window.currentBase);
            $('#ticker-quote-legend').html(window.currentQuote);
            
            // Rest of data
            liveTicker(v);
            
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
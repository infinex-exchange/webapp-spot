$(document).on('prePairSelected', function() {
    // Pair from URL
    
    var pathArray = window.location.pathname.split('/');
    var pathPairName = pathArray[pathArray.length - 1].replace('_', '/');
    if(pathPairName != 'spot')
        window.currentPair = pathPairName;
    else
        window.history.replaceState(null, document.title, '/spot/' + window.currentPair.replace('/', '_'));

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
            $(document).trigger('pairSelected');
            
            // Document title
            document.title = v.price + ' | ' + k + ' | Vayamos Spot';
            
            // Ticker HTML
            $('#ticker-name').html(k);
            $('#ticker-base-name').html(v.base_name);
            $('#ticker-price').html(v.price);
            $('#ticker-change').html(v.change + '%');
            if(v.change < 0) $('#ticker-change').addClass('text-danger');
            if(v.change > 0) $('#ticker-change').addClass('text-success');
            $('#ticker-high').html(v.high);
            $('#ticker-low').html(v.low);
            $('#ticker-vol-base').html(v.vol_base);
            $('#ticker-vol-quote').html(v.vol_quote);
            $('#ticker-base-legend').html(window.currentBase);
            $('#ticker-quote-legend').html(window.currentQuote);
            
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
$(document).on('marketsLoaded', function() {
    var pathArray = window.location.pathname.split('/');
    var pathPairName = pathArray[pathArray.length - 1].replace('_', '/');
    
    $(window.markets).each(function() {
        if(this.name == pathPairName) {
            window.currentPair = this.name;
        }
    });
    if(typeof(window.currentPair) == 'undefined') {
        window.currentPair = window.markets[0].name;
        window.history.replaceState(null, document.title, '/spot/' + window.currentPair.replace('/', '_'));
    }
    
    var pairExplode = window.currentPair.split('/');
    window.currentBase = pairExplode[0];
    window.currentQuote = pairExplode[1];

    $.ajax({
        url: config.apiUrl + '/spot/tickers_ex',
        type: 'POST',
        data: JSON.stringify({
            'query': [window.currentPair]
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .done(function (data) {
        if(data.success) {
            var ticker = data.tickers[0];
            
            window.currentBasePrecision = ticker.base_precision;
            window.currentQuotePrecision = ticker.quote_precision;
            $(document).trigger('pairSelected');
            
            document.title = ticker.price + ' | ' + ticker.name + ' | Vayamos Spot';
            
            $('#ticker-name').html(ticker.name);
            $('#ticker-base-name').html(ticker.base_name);
            $('#ticker-price').html(ticker.price);
            $('#ticker-change').html(ticker.change + '%');
            if(ticker.change < 0) $('#ticker-change').addClass('text-danger');
            if(ticker.change > 0) $('#ticker-change').addClass('text-success');
            $('#ticker-high').html(ticker.high);
            $('#ticker-low').html(ticker.low);
            $('#ticker-vol-base').html(ticker.vol_base);
            $('#ticker-vol-quote').html(ticker.vol_quote);
            $('#ticker-base-legend').html(window.currentBase);
            $('#ticker-quote-legend').html(window.currentQuote);
            
            $(document).trigger('renderingStage'); // 2
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {  
    });
});

$(document).onFirst('pairSelected', function() {
    window.multiEvents['pairSelected'] = true;
});
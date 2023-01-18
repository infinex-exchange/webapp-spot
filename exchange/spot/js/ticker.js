function liveTicker(data) {
    // Current market price
    window.currentMarketPrice = new BigNumber(data.price);
    
    // Document title
    document.title = data.price + ' | ' + window.currentPair + ' | Infinex Spot';
    
    // Ticker HTML
    var color = '';
    var bnCurrent = new BigNumber(data.price);
    var bnPrevious = new BigNumber(data.previous);
    var comp = bnCurrent.comparedTo(bnPrevious);
    if(comp == 1) color = 'text-green';
    else if(comp == -1) color = 'text-red';
    
    var priceDiv = $('.ticker-price');
    priceDiv.removeClass('text-green text-red');
    priceDiv.html(data.price);
    priceDiv.addClass(color);
    
    var obm = $('.orderbook-middle-price, .orderbook-middle-arrow');
    obm.removeClass('text-green text-red');
    obm.addClass(color);
    
    $('.orderbook-middle-price').html(bnCurrent.toFixed(window.currentQuotePrecision));
    
    var obmArrow = $('.orderbook-middle-arrow');
    obmArrow.removeClass('fa-arrow-down fa-arrow-up');
    if(comp == 1) obmArrow.addClass('fa-arrow-up');
    else if(comp == -1) obmArrow.addClass('fa-arrow-down');
    
    var changeDiv = $('.ticker-change');
    color = '';
    var changeStr = data.change;
    if(data.change > 0) {
        color = 'text-green';
        changeStr = '+' + changeStr;
    }
    if(data.change < 0)
        color = 'text-red';
    changeDiv.removeClass('text-green text-red');
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
    if(pathPairName != 'spot' && pathPairName != '')
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
            
            // Now it's time to run AjaxScroll
            filterMarketsByQuote(v.quote);
            
            // Rest of data
            liveTicker(v);
            $(document).trigger('pairSelected');
            
            // Ticker HTML
            $('.ticker-name').html(v.pair);
            $('.ticker-base-name').html(v.base_name);
            $('.ticker-base-legend').html(window.currentBase);
            $('.ticker-quote-legend').html(window.currentQuote);
            
            // Experimental
            if(v.experimental)
                $('.experimental').removeClass('d-none');
            else
                $('.experimental').addClass('d-none');
            
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

$(document).ready(function() {
    $('.experimental').click(function() {
        msgBox(`We have classified this coin as experimental. We cannot guarantee the correct operation
            of deposits and withdrawals, because the official wallet provided by the developers of this project
            is unstable and often causes some issues. We do not provide any technical support for this coin.
            You can contact the developers of the project directly and request an update to the official client.
            Unpredictable losts of synchronization, from a few minutes to even couple of weeks can occur.
            These cases are beyond our control. Use this coin at your own risk.`);
    });
});
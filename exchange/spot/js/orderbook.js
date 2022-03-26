function orderBookAppend(side, row) {
    var bnPrice = new BigNumber(row.price);
    var bnAmount = new BigNumber(row.amount);
    var bnTotal = bnPrice.multipliedBy(bnAmount);
    var strTotal = bnTotal.toFixed(window.currentQuotePrecision);
    
    var color = '';
    if(side == 'bid') color = 'text-success';
    else color = 'text-danger';
    
    var div = null
    if(side == 'bid') div = $('#orderbook-buy');
    else div = $('#orderbook-sell');
    
    div.append(`
        <div class="row">
            <div class="col-4 ${color}">
                ${row.price}
            </div>
            <div class="col-4 text-end">
                ${row.amount}
            </div>
            <div class="col-4 text-end">
                ${strTotal}
            </div>
        </div>
    `);
}

$(document).on('pairSelected', function() {
    $.ajax({
        url: config.apiUrl + '/spot/orderbook',
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
            data.bids = data.bids.slice(0, 20).reverse();
            data.asks = data.asks.slice(-20).reverse();
              
            $(data.bids).each(function() {
                orderBookAppend('bid', this);
            });
            
            $(data.asks).each(function() {
                orderBookAppend('ask', this);
            });
            
            $(document).trigger('renderingStage'); // 7
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);  
    }); 
});
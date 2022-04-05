function orderBookAppend(side, row) {
    var bnPrice = new BigNumber(row.price);
    var bnAmount = new BigNumber(row.amount);
    var bnTotal = bnPrice.multipliedBy(bnAmount);
    var strTotal = bnTotal.toFixed(window.currentQuotePrecision);
    
    if(typeof(window.orderBookTotalMax) === 'undefined' || bnTotal.gt(window.orderBookTotalMax)) {
        window.orderBookTotalMax = bnTotal;
        document.body.style.setProperty('--orderbook-total-max', strTotal);
    }
    
    var color = '';
    if(side == 'bid') color = 'text-green';
    else color = 'text-red';
    
    var div = null
    if(side == 'bid') div = $('#orderbook-buy');
    else div = $('#orderbook-sell');
    
    div.append(`
        <div class="row" data-side="${side}" data-price="${row.price}" onClick="orderBookClick(this)"
             style="background-size: calc(${strTotal} / var(--orderbook-total-max) * 100%)">
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

function orderBookClick(row) {
    if(window.orderType == 'MARKET') return;
    
    if($(row).attr('data-side') == 'bid') {
        $('#form-sell-price').val($(row).attr('data-price')).trigger('input');
    }
    
    else {
        $('#form-buy-price').val($(row).attr('data-price')).trigger('input');
    }
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
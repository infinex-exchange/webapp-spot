function orderBookUpdate(side, row) {
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
    
    var existing = div.find('.row[data-price="' + row.price + '"]');
    
    if(row.amount == 0) {
        if(existing.length) existing.remove();
        return;
    }
    
    if(existing.length) {
        var price = existing.find('.price');
        price.removeClass('text-green text-red');
        price.addClass(color);
        price.html(row.price);
        existing.find('.amount').html(row.amount);
        existing.find('.total').html(strTotal);
    }
    
    else {
        var html = `
            <div class="row" data-side="${side}" data-price="${row.price}" onClick="orderBookClick(this)"
                    style="background-size: calc(${strTotal} / var(--orderbook-total-max) * 100%)">
                <div class="col-4 price ${color}">
                    ${row.price}
                </div>
                <div class="col-4 amount text-end">
                    ${row.amount}
                </div>
                <div class="col-4 total text-end">
                    ${strTotal}
                </div>
            </div>
        `;
        
        var inserted = false;    
        div.children().each(function() {
            if(!inserted
               &&
              (
                side == 'bid' && bnPrice.lt($(this).attr('data-price'))
                ||
                side == 'ask' && bnPrice.gt($(this).attr('data-price'))
              )
             ) {
                $(html).insertBefore($(this));
                inserted = true;
            }
        });
        
        if(!inserted)
            div.append(html);
    }
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
                orderBookUpdate('bid', this);
            });
            
            $(data.asks).each(function() {
                orderBookUpdate('ask', this);
            });
            
            window.wsClient.sub(
                window.currentPair + '@orderBook',
                function(data) {
                    if(data.side == 'BUY')
                        orderBookUpdate('bid', data);
                    else
                        orderBookUpdate('ask', data);
                },
                function(error) {
                    msgBoxRedirect(error);
                }
            );
            
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
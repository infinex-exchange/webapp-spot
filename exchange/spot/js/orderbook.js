function orderBookUpdate(side, row) {
    if(typeof(window.orderBookTotalMax) === 'undefined') {
        window.orderBookTotalMax = new BigNumber(0);
        document.body.style.setProperty('--orderbook-total-max', '0');
    }
    
    var bnPrice = new BigNumber(row.price);
    var bnAmount = new BigNumber(row.amount);
    var bnTotal = bnPrice.multipliedBy(bnAmount);
    var strTotal = bnTotal.toFixed(window.currentQuotePrecision);
    var strTotalSeparated = bnTotal.toFormat(window.currentQuotePrecision);
    var strAmountSeparated = bnAmount.toFormat(window.currentBasePrecision);
    
    var color = '';
    if(side == 'bid') color = 'text-green';
    else color = 'text-red';
    
    var div = null
    if(side == 'bid') div = $('#orderbook-buy');
    else div = $('#orderbook-sell');
    
    var existing = div.find('.orderbook-item[data-price="' + row.price + '"]');
    
    if(existing.length) {
        
        // Delete
        if(bnAmount.eq(0)) {
            existing.remove();
        }
        
        // Update
        else {
            var price = existing.find('.price');
            price.removeClass('text-green text-red');
            price.addClass(color);
            price.html(row.price);
            existing.find('.amount').html(strAmountSeparated);
            existing.find('.total').html(strTotalSeparated);
            existing.attr('data-total', strTotal);
            existing.css({"background-size": `calc(${strTotal} / var(--orderbook-total-max) * 100%) 100%`});
        }
    }
    
    // Add
    else if(! bnAmount.eq(0)) {
        var html = `
            <div class="row orderbook-item" data-side="${side}" data-price="${row.price}" data-total="${strTotal}"
                    onClick="orderBookClick(this)"
                    style="background-size: calc(${strTotal} / var(--orderbook-total-max) * 100%) 100%">
                <div class="mobile-ob-col col-lg-4 price ${color}">
                    ${row.price}
                </div>
                <div class="mobile-ob-col col-lg-4 amount text-end">
                    ${strAmountSeparated}
                </div>
                <div class="mobile-ob-col col-lg-4 total text-end">
                    ${strTotalSeparated}
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
    
    // Update total max
    var newMax = new BigNumber(0);
    $('.orderbook-item').each(function() {
        var currentTotal = new BigNumber($(this).attr('data-total'));
        if(currentTotal.gt(newMax))
            newMax = currentTotal;
    });
    window.orderBookTotalMax = newMax;
    document.body.style.setProperty('--orderbook-total-max', newMax.toFixed(window.currentQuotePrecision));
    
    // Scroll asks to bottom
    if(side == 'ask') {
        document.getElementById("orderbook-sell").scrollTop = document.getElementById("orderbook-sell").scrollHeight;
    }
}

function orderBookClick(row) {
    if(window.orderType == 'MARKET') return;
    $('.form-price').data('rval', $(row).attr('data-price'))
                    .trigger('setVal')
                    .trigger('updateCalc');
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

$(document).ready(function() {
    $('.orderbook-btn-display').on('click', function() {
        var display = $(this).data('display');
        $('#orderbook').removeClass('orderbook-display-split orderbook-display-asks orderbook-display-bids')
                       .addClass('orderbook-display-' + display);
    });
});
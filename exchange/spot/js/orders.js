function cancelOrder(obid) {
    $.ajax({
        url: config.apiUrl + '/spot/open_orders/cancel',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            obid: obid
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(!data.success) {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function renderOpenOrder(data) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    var total = new BigNumber(data.amount);
    total = total.multipliedBy(data.price);
    total = total.dp(data.quote_prec).toString();
    
    var filled = '-';
    var filledPerc = '';
    if(typeof(data.filled) !== 'undefined')
        filled = data.filled;
    else if(data.type == 'LIMIT')
        filled = 0;
    if(filled !== '-')
        filledPerc = '(' + Math.round(data.filled / data.amount * 100) + '%)';
    
    var stopStr = '-';
    if(typeof(data.stop) !== 'undefined') {
        if(data.side == 'BUY') stopStr = '&ge; ' + data.stop;
        else stopStr = '&le; ' + data.stop;
    }
    
    var color = 'text-green';
    if(data.side == 'SELL') color = 'text-red';
    
    return `
        <div class="row hoverable orders-open-item px-1 py-2 py-lg-1" data-obid="${data.obid}" data-amount="${data.amount}">
            <div class="sm-w-50 order-2 order-lg-1 time" style="width: 12%">
                ${time}
            </div>
            <div class="sm-w-50 order-1 order-lg-2 pair" style="width: 10%">
                ${data.pair}
            </div>
            <div class="d-none d-lg-block order-lg-3" style="width: 10%">
                ${data.type}
            </div>
            <div class="d-none d-lg-block order-lg-4 ${color}" style="width: 4%">
                ${data.side}
            </div>
            <div class="sm-w-100 order-3 d-lg-none pb-2">
                <span class="${color}">${data.side}</span>&nbsp;/&nbsp;${data.type}
            </div>
            <div class="sm-w-50 d-lg-none order-4 secondary">
                Price:
            </div>
            <div class="sm-w-50 order-5 order-lg-5 text-end" style="width: 11%">
                ${data.price}
            </div>
            <div class="sm-w-50 d-lg-none order-6 secondary">
                Amount:
            </div>
            <div class="sm-w-50 order-7 order-lg-6 text-end" style="width: 11%">
                ${data.amount}
            </div>
            <div class="sm-w-50 d-lg-none order-8 secondary">
                Filled:
            </div>
            <div class="sm-w-50 order-9 order-lg-7 text-end filled pe-lg-0" style="width: 11%">
                ${filled}<div class="d-inline d-lg-none"> <span class="filled-perc">${filledPerc}</span></div>
            </div>
            <div class="d-none d-lg-block order-lg-8 text-center ps-0" style="width: 5%">
                <span class="filled-perc">${filledPerc}</span>
            </div>
            <div class="sm-w-50 d-lg-none order-10 secondary">
                Total:
            </div>
            <div class="sm-w-50 order-11 order-lg-9 text-end" style="width: 11%">
                ${total}
            </div>
            <div class="sm-w-50 d-lg-none order-12 secondary">
                Triggers:
            </div>
            <div class="sm-w-50 order-13 order-lg-10 text-end" style="width: 12%">
                ${stopStr}
            </div>
            <div class="d-none d-lg-block order-lg-11 text-end ps-0 secondary" style="width: 3%">
                <i class="fa-solid fa-xmark" onClick="cancelOrder(${data.obid})"></i>
            </div>
            <div class="sm-w-100 d-lg-none order-14 text-end pt-2">
                <button type="button" class="btn btn-sm bg-red" onClick="cancelOrder(${data.obid})">
                    <i class="fa-solid fa-xmark"></i>
                    Cancel
                </button>
            </div>
        </div>
    `;
}

function toggleHistoryOrderExpand(row) {
    if($(row).find('.trades-in-order-item').length > 0) {
        $(row).toggleClass('expand-trades');
    }
}

function recalcHistoryOrder(obid) {
    var ohItem = $('.orders-history-item[data-obid="' + data.obid + '"]');
    if(!ohItem.length) return;
    var quotePrec = ohItem.data('quote-prec');
    
    var tradesInOrder = ohItem.find('.trades-in-order-item');
    if(!tradesInOrder.length) return;
    
    var averageWeight = new BigNumber(0);
    var averageSum = new BigNumber(0);
    var totalSum = new BigNumber(0);
    
    tradesInOrder.each(function() {
        var amount = new BigNumber( $(this).data('amount') );
        var price = new BigNumber( $(this).data('price') );
        var total = new BigNumber( $(this).data('total') );
        averageWeight = averageWeight.plus(weight);
        averageSum = averageSum.plus(amount.times(price));
        totalSum = totalSum.plus(total);
    });
            
    var averageStr = averageSum.div(averageWeight).dp(quotePrec).toString();
    var totalStr = totalSum.dp(quotePrec).toString();
    
    ohItem.find('.average').html(averageStr);
    ohItem.find('.total').html(totalStr);
}

function renderHistoryOrder(data) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    var status = 'OPEN';
    if(typeof(data.status) !== 'undefined')
        status = data.status;
    
    var amountStr = '';
    if(typeof(data.amount) !== 'undefined') amountStr = data.amount + ' ' + data.base;
    else amountStr = data.total + ' ' + data.quote;
    
    var stopStr = '-';
    if(typeof(data.stop) !== 'undefined') {
        if(data.side == 'BUY') stopStr = '&ge; ' + data.stop;
        else stopStr = '&le; ' + data.stop;
    }
    
    var filled = '-';
    if(typeof(data.filled) !== 'undefined')
        filled = data.filled;
    
    var priceStr = 'MARKET';
    if(data.type != 'MARKET')
        priceStr = data.price;
    
    var color = 'text-green';
    if(data.side == 'SELL') color = 'text-red';
    
    var displayButtons = 'd-none';
    var trades = '';
    
    var total = '-';
    if(typeof(data.filled) !== 'undefined')
        total = '0';

    if(typeof(data.trades) !== 'undefined' && data.trades.length > 0) {        
        displayButtons = '';
        
        $.each(data.trades, function(k, v) {
            trades += renderHistoryTrade(v, true);
        });
    }
    
    return `
        <div class="row hoverable orders-history-item px-1 py-2 py-lg-1" data-obid="${data.obid}" data-quote-prec="${data.quote_prec}" onClick="toggleHistoryOrderExpand(this)">
            <div class="d-none d-lg-block order-lg-1 pe-0 text-center secondary" style="width: 2%">
                <span class="buttons ${displayButtons}">
                    <i class="expand-button fa-solid fa-square-plus"></i>
                    <i class="collapse-button fa-solid fa-square-minus"></i>
                </span>
            </div>
            <div class="sm-w-50 order-2 order-lg-2 time" style="width: 11%">
                ${time}
                <span class="buttons d-lg-none ps-2 ${displayButtons}">
                    <i class="expand-button fa-solid fa-angle-down"></i>
                    <i class="collapse-button fa-solid fa-angle-up"></i>
                </span>
            </div>
            <div class="sm-w-50 order-1 order-lg-3 pair" style="width: 8%">
                ${data.pair}
            </div>
            <div class="d-none d-lg-block order-lg-4" style="width: 8%">
                ${data.type}
            </div>
            <div class="d-none d-lg-block order-lg-5 ${color}" style="width: 4%">
                ${data.side}
            </div>
            <div class="sm-w-50 order-3 d-lg-none pb-2">
                <span class="${color}">${data.side}</span>&nbsp;/&nbsp;${data.type}
            </div>
            <div class="sm-w-50 d-lg-none order-5 secondary">
                Price:
            </div>
            <div class="sm-w-50 order-6 order-lg-6 text-end" style="width: 9%">
                ${priceStr}
            </div>
            <div class="sm-w-50 d-lg-none order-7 secondary">
                Average:
            </div>
            <div class="sm-w-50 order-8 order-lg-7 text-end average" style="width: 9%">
                -
            </div>
            <div class="sm-w-50 d-lg-none order-9 secondary">
                Amount:
            </div>
            <div class="sm-w-50 order-10 order-lg-8 text-end" style="width: 10%">
                ${amountStr}
            </div>
            <div class="sm-w-50 d-lg-none order-11 secondary">
                Filled:
            </div>
            <div class="sm-w-50 order-12 order-lg-9 text-end filled" style="width: 10%">
                ${filled}
            </div>
            <div class="sm-w-50 d-lg-none order-13 secondary">
                Total:
            </div>
            <div class="sm-w-50 order-14 order-lg-10 text-end total" style="width: 10%">
                ${total}
            </div>
            <div class="sm-w-50 d-lg-none order-15 secondary">
                Triggers:
            </div>
            <div class="sm-w-50 order-16 order-lg-11 text-end" style="width: 11%">
                ${stopStr}
            </div>
            <div class="sm-w-50 order-4 order-lg-12 text-end pb-2 pb-lg-0" style="width: 8%">
                <span class="status">${status}</span>
            </div>
            
            <div class="col-12 order-17 order-lg-13 pt-2 px-4 px-lg-5 inner">
                <div class="row secondary d-none d-lg-flex px-1">
                    <div style="width: 18%">
                        <h6>Date</h6>
                    </div>
                    <div class="text-end" style="width: 14%">
                        <h6>Price</h6>
                    </div>
                    <div class="text-end" style="width: 14%">
                        <h6>Amount</h6>
                    </div>
                    <div class="text-end" style="width: 14%">
                        <h6>Total</h6>
                    </div>
                    <div class="text-end" style="width: 14%">
                        <h6>Fee</h6>
                    </div>
                    <div class="text-end" style="width: 12%">
                        <h6>Role</h6>
                    </div>
                </div>
                
                <div class="row primary d-lg-none">
                    <div class="col-12 d-lg-none text-center py-2">
                        <h5>Trades:</h5>
                    </div>
                </div>
                
                <div class="trades-in-order-data">
                    ${trades}
                </div>
            </div>
            
        </div>
    `;
}

function renderHistoryTrade(data, inOrder) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    var inOrdClass = 'trades-history-item';
    if(inOrder) inOrdClass = 'trades-in-order-item'
    
    var timeWPerc = 14;
    if(inOrder) timeWPerc = 18;
    
    var innerHtml = '';
    if(inOrder) {
	    innerHtml = `
		    <div class="sm-w-50 d-lg-none order-1 secondary">
		        Time:
		    </div>
	    `;
    }
    else {
        var color = 'text-green';
        if(data.side == 'SELL') color = 'text-red';
        
        innerHtml = `
            <div class="sm-w-50 pair order-1 order-lg-2" style="width: 12%">
                ${data.pair}
            </div>
            <div class="sm-w-100 order-3 order-lg-3 pb-2 pb-lg-0 ${color}" style="width: 6%">
                ${data.side}
            </div>
        `;
    }
    
    var html = `
        <div class="row hoverable px-1 py-2 py-lg-1 ${inOrdClass}" data-price="${data.price}" data-amount="${data.amount}" data-total="${data.total}">
            <div class="sm-w-50 time order-2 order-lg-1" style="width: ${timeWPerc}%">
                ${time}
            </div>
            ${innerHtml}
            <div class="sm-w-50 d-lg-none order-4 secondary">
                Price:
            </div>
            <div class="sm-w-50 order-5 order-lg-4 text-end" style="width: 14%">
                ${data.price}
            </div>
            <div class="sm-w-50 d-lg-none order-6 secondary">
                Amount:
            </div>
            <div class="sm-w-50 order-7 order-lg-5 text-end" style="width: 14%">
                ${data.amount}
            </div>
            <div class="sm-w-50 d-lg-none order-8 secondary">
                Total:
            </div>
            <div class="sm-w-50 order-9 order-lg-6 text-end" style="width: 14%">
                ${data.total}
            </div>
            <div class="sm-w-50 d-lg-none order-10 secondary">
                Fee:
            </div>
            <div class="sm-w-50 order-11 order-lg-7 text-end" style="width: 14%">
                ${data.fee}
            </div>
            <div class="sm-w-50 d-lg-none order-12 secondary">
                Role:
            </div>
            <div class="sm-w-50 order-13 order-lg-8 text-end" style="width: 12%">
                ${data.role}
            </div>
        </div>
    `;
    
    return html;
}

$(document).on('authChecked pairSelected', function() {
    if(typeof(window.multiEvents['authChecked']) == 'undefined' || typeof(window.multiEvents['pairSelected']) == 'undefined') return;
    
    if(window.loggedIn) {
        // -------------------- OPEN ORDERS AS --------------------
        
        window.openOrdersAS = new AjaxScroll(
            $('#orders-open-data'),
            $('#orders-open-preloader'),
            {
                api_key: window.apiKey,
                sort_pair: window.currentPair
            },
            function() {
                this.data.offset = this.offset;
                var thisAS = this;
            
            //---
    $.ajax({
        url: config.apiUrl + '/spot/open_orders',
        type: 'POST',
        data: JSON.stringify(thisAS.data),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.orders, function(k, v) {
                thisAS.append(renderOpenOrder(v));
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0)
                $(document).trigger('renderingStage'); // 5
            
            if(data.orders.length != 50)
                thisAS.noMoreData(); 
        }
        else {
            msgBoxRedirect(data.error);
            thisAS.done();
            thisAS.noMoreData();
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
        thisAS.done();
        thisAS.noMoreData();  
    });
            //---
        
            },
            true
        );
        
        // -------------------- ORDERS HISTORY AS --------------------
        
        window.ordersHistoryAS = new AjaxScroll(
            $('#orders-history-data'),
            $('#orders-history-preloader'),
            {
                api_key: window.apiKey
            },
            function() {
                this.data.offset = this.offset;
                var thisAS = this;
            
            //---
    $.ajax({
        url: config.apiUrl + '/spot/orders_history',
        type: 'POST',
        data: JSON.stringify(thisAS.data),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.orders, function(k, v) {
                thisAS.append(renderHistoryOrder(v));
                recalcHistoryOrder(v.obid);
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0)
                $(document).trigger('renderingStage'); // 6
            
            if(data.orders.length != 50)
                thisAS.noMoreData(); 
        }
        else {
            msgBoxRedirect(data.error);
            thisAS.done();
            thisAS.noMoreData();
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
        thisAS.done();
        thisAS.noMoreData();  
    });
            //---
        
            },
            true
        );
        
        // -------------------- TRADES HISTORY AS --------------------
        
        window.tradesHistoryAS = new AjaxScroll(
            $('#trades-history-data'),
            $('#trades-history-preloader'),
            {
                api_key: window.apiKey
            },
            function() {
                this.data.offset = this.offset;
                var thisAS = this;
            
            //---
    $.ajax({
        url: config.apiUrl + '/spot/trades_history',
        type: 'POST',
        data: JSON.stringify(thisAS.data),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.trades, function(k, v) {
                thisAS.append(renderHistoryTrade(v, false));
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0)
                $(document).trigger('renderingStage');
            
            if(data.trades.length != 50)
                thisAS.noMoreData(); 
        }
        else {
            msgBoxRedirect(data.error);
            thisAS.done();
            thisAS.noMoreData();
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
        thisAS.done();
        thisAS.noMoreData();  
    });
            //---
        
            },
            true
        );
        
        // -------------------- END OF AS --------------------
    } else {
        $(document).trigger('renderingStage'); // 5
        $(document).trigger('renderingStage'); // 6
        $(document).trigger('renderingStage');
    }
});

$(document).on('wsAuth', function() {   
    window.wsClient.sub(
        ['myOrders', 'myTrades'],
        function(data) {
            $(document).trigger(typeof(data.event) === 'undefined' ? 'trade' : data.event, [data]);
        },
        function(error) {
            msgBoxRedirect(error);
        }
    );
});

$(document).on('orderAccepted', function(e, data) {
    // Add to open orders
    if(data.time_in_force == 'GTC')
        window.openOrdersAS.prepend(renderOpenOrder(data));
    
    // Add to orders history
    window.ordersHistoryAS.prepend(renderHistoryOrder(data));
});

$(document).on('orderUpdate', function(e, data) {
    
    // Status changed
    if(typeof(data.status) !== 'undefined') {
        // Remove from open orders
        $('.orders-open-item[data-obid="' + data.obid + '"]').remove();
        
        // Change status in orders history
        $('.orders-history-item[data-obid="' + data.obid + '"]').find('.status').html(data.status);
    }
    
    // Filled changed
    if(typeof(data.filled) !== 'undefined') {
         // Update filled and filled% in open orders
        var ooItem = $('.orders-open-item[data-obid="' + data.obid + '"]');
        if(ooItem.length) {
            var filledPerc = '(' + Math.round(data.filled / ooItem.data('amount') * 100) + '%)';
            ooItem.find('.filled').html(data.filled);
            ooItem.find('.filled-perc').html(filledPerc);
        }
        
        // Update filled in orders history
        var ohItem = $('.orders-history-item[data-obid="' + data.obid + '"]');
        ohItem.find('.filled').html(data.filled);
        if(data.filled == 0) ohItem.find('.total').html('0');
    }
    
});

$(document).on('trade', function(e, data) {
    // Add trade to trades history
    window.tradesHistoryAS.prepend(renderHistoryTrade(data, false));
    
    // Add trade to orders history
    var ohItem = $('.orders-history-item[data-obid="' + data.obid + '"]');
    if(ohItem.length) {
        ohItem.find('.trades-in-order-data').prepend(renderHistoryTrade(data, true));
        recalcHistoryOrder(v.obid);
        ohItem.find('.buttons').removeClass('d-none');
    }
});
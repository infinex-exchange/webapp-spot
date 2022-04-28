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
        if(data.success) {
            setTimeout(updateBalance, 500);
        }
        else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function renderOpenOrder(data) {
    if(data.type == 'MARKET') return;
    
    var time = new Date(data.time * 1000).toLocaleString();
    
    var total = new BigNumber(data.amount);
    total = total.multipliedBy(data.price);
    total = total.toFixed(window.currentQuotePrecision);
    
    var filled = 0;
    if(typeof(data.filled) !== 'undefined') filled = data.filled;
    var filledPerc = Math.round(filled / data.amount * 100);
    
    var stopStr = '';
    if(typeof(data.stop) !== 'undefined') {
        if(data.side == 'BUY') stopStr = '&ge; ' + data.stop;
        else stopStr = '&le; ' + data.stop;
    }
    
    return `
        <div class="row hoverable orders-open-item" data-obid="${data.obid}">
            <div style="width: 12%">
                ${time}
            </div>
            <div style="width: 10%">
                ${data.pair}
            </div>
            <div style="width: 10%">
                ${data.type}
            </div>
            <div style="width: 4%">
                ${data.side}
            </div>
            <div class="text-end" style="width: 11%">
                ${data.price}
            </div>
            <div class="text-end" style="width: 11%">
                ${data.amount}
            </div>
            <div class="text-end filled pe-0" style="width: 11%">
                ${filled}
            </div>
            <div class="text-center ps-0" style="width: 5%">
                (<span class="filled-perc">${filledPerc}</span>%)
            </div>
            <div class="text-end" style="width: 11%">
                ${total}
            </div>
            <div class="text-end" style="width: 12%">
                ${stopStr}
            </div>
            <div class="text-end ps-0" style="width: 3%">
                <i class="fa-solid fa-xmark" onClick="cancelOrder(${data.obid})"></i>
            </div>
        </div>
    `;
}

function toggleHistoryOrderExpand(row) {
    if($(row).find('.trade-in-order-item').length > 0)
        $(row).toggleClass('expand-trades');
}

function renderHistoryOrder(data) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    var filledStr = '-';
    if(typeof(data.filled) !== 'undefined') {
        var filledPerc = Math.round(data.filled / data.amount * 100);
        filledStr = `${data.filled} (${filledPerc}%)`;
    }
    
    var priceStr = 'MARKET';
    if(data.type != 'MARKET')
        priceStr = data.price;
    
    var stopStr = '';
    if(typeof(data.stop) !== 'undefined') {
        stopStr = data.stop + ' &rarr; ';
    }
    
    var expandBtn = '';
    var trades = '';
    if(data.trades.length > 0) {
        expandBtn = '<i class="fa-solid fa-square-plus"></i> ';
        
        $.each(data.trades, function(k, v) {
            trades += renderTradeInHistoryOrder(v);
        });
    }
    
    var amountStr = '';
    if(typeof(data.amount) !== 'undefined') {
        amountStr = data.amount;
    }
    else {
        amountStr = 'Total: ' + data.total;
    }
    
    return `
        <div class="row hoverable orders-history-item" data-obid="${data.obid}" onClick="toggleHistoryOrderExpand(this)">
            <div class="col-2">
                ${expandBtn}${time}
            </div>
            <div class="col-1">
                ${data.pair}
            </div>
            <div class="col-1">
                ${data.type}
            </div>
            <div class="col-1">
                ${data.side}
            </div>
            <div class="col-1 text-end">
                AVG_HERE!
            </div>
            <div class="col-2 text-end">
                ${stopStr}${priceStr}
            </div>
            <div class="col-2 text-end filled">
                ${filledStr}
            </div>
            <div class="col-1 text-end">
                ${amountStr}
            </div>
            <div class="col-1 text-end">
                ${data.status}
            </div>
            
            <div class="col-8 m-3 inner">
                <div class="row">
                    <div class="col-2">
                        <h6>Date</h6>
                    </div>
                    <div class="col-2 text-end">
                        <h6>Amount</h6>
                    </div>
                    <div class="col-2 text-end">
                        <h6>Price</h6>
                    </div>
                    <div class="col-2 text-end">
                        <h6>Total</h6>
                    </div>
                    <div class="col-2 text-end">
                        <h6>Fee</h6>
                    </div>
                    <div class="col-2 text-end">
                        <h6>Role</h6>
                    </div>
                </div>
                
                <div class="trades-in-order-data">
                    ${trades}
                </div>
            </div>
            
        </div>
    `;
}

function renderHistoryTrade(data) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    return `
        <div class="row hoverable">
            <div class="col-1">
                ${time}
            </div>
            <div class="col-1">
                ${data.pair}
            </div>
            <div class="col-1">
                ${data.side}
            </div>
            <div class="col-2 text-end">
                ${data.amount}
            </div>
            <div class="col-2 text-end">
                ${data.price}
            </div>
            <div class="col-2 text-end">
                ${data.total}
            </div>
            <div class="col-2 text-end">
                ${data.fee}
            </div>
            <div class="col-1 text-end">
                ${data.role}
            </div>
        </div>
    `;
}

function renderTradeInHistoryOrder(data) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    return `
        <div class="row trade-in-order-item hoverable">
            <div class="col-2">
                ${time}
            </div>
            <div class="col-2 text-end">
                ${data.amount}
            </div>
            <div class="col-2 text-end">
                ${data.price}
            </div>
            <div class="col-2 text-end">
                ${data.total}
            </div>
            <div class="col-2 text-end">
                ${data.fee}
            </div>
            <div class="col-2 text-end">
                ${data.role}
            </div>
        </div>
    `;
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
            
            if(data.orders.length != 25)
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
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0)
                $(document).trigger('renderingStage'); // 6
            
            if(data.orders.length != 25)
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
                thisAS.append(renderHistoryTrade(v));
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0)
                $(document).trigger('renderingStage');
            
            if(data.trades.length != 25)
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

$(document).on('orderCanceled orderFilled orderKilled', function(e, data) {
    if(typeof(data.obid) !== 'undefined')
        $('.orders-open-item[data-obid="' + data.obid + '"]').remove();
});

$(document).on('orderNew', function(e, data) {
    if(typeof(data.obid) !== 'undefined')
        window.openOrdersAS.prepend(renderOpenOrder(data));
});

$(document).on('orderPartialFilled', function(e, data) {
    $('.orders-open-item[data-obid="' + data.obid + '"]').find('.filled').html(data.filled);
});
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
    var time = new Date(data.time * 1000).toLocaleString();
    
    var total = new BigNumber(data.amount);
    total = total.multipliedBy(data.price);
    total = total.toFixed(window.currentQuotePrecision);
    
    var filledPerc = Math.round(data.filled / data.amount * 100);
    
    var stopStr = '';
    if(typeof(data.stop) !== 'undefined') {
        if(data.side == 'BUY') stopStr = '&ge; ' + data.stop;
        else stopStr = '&le; ' + data.stop;
    }
    
    return `
        <div class="row hoverable orders-open-item" data-obid="${data.obid}" data-amount="${data.amount}">
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
                ${data.filled}
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
    if($(row).find('.trade-in-order-item').length > 0) {
        $(row).toggleClass('expand-trades');
        $(row).find('.fa-solid').toggleClass('fa-square-plus');
        $(row).find('.fa-solid').toggleClass('fa-square-minus');
    }
}

function renderHistoryOrder(data) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    var amountStr = '-';
    if(typeof(data.amount) !== 'undefined') amountStr = data.amount;
    
    var stopStr = '';
    if(typeof(data.stop) !== 'undefined') {
        if(data.side == 'BUY') stopStr = '&ge; ' + data.stop;
        else stopStr = '&le; ' + data.stop;
    }
    
    var priceStr = 'MARKET';
    if(data.type != 'MARKET')
        priceStr = data.price;
    
    var expandBtn = '';
    var trades = '';
    var averageWeight = '0';
    var averageSum = '0';
    var average = '-';
    
    if(data.trades.length > 0) {
        expandBtn = '<i class="fa-solid fa-square-plus"></i> ';
        
        averageWeight = new BigNumber(0);
        averageSum = new BigNumber(0);
        
        $.each(data.trades, function(k, v) {
            var weight = new BigNumber(v.amount);
            averageWeight = averageWeight.plus(weight);
            averageSum = averageSum.plus(weight.times(v.price)); 
            trades += renderHistoryTrade(v, true);
        });
        
        average = averageSum.div(averageWeight).dp(window.currentQuotePrecision).toString();
        averageWeight = averageWeight.toString();
        averageSum = averageSum.toString();
    }
    
    return `
        <div class="row hoverable orders-history-item" data-obid="${data.obid}" onClick="toggleHistoryOrderExpand(this)">
            <div class="pe-0 text-center" style="width: 2%">
                ${expandBtn}
            </div>
            <div style="width: 11%">
                ${time}
            </div>
            <div style="width: 8%">
                ${data.pair}
            </div>
            <div style="width: 8%">
                ${data.type}
            </div>
            <div style="width: 4%">
                ${data.side}
            </div>
            <div class="text-end" style="width: 9%">
                ${priceStr}
            </div>
            <div class="text-end average" data-sum="${averageSum}" data-weight="${averageWeight}" style="width: 9%">
                ${average}
            </div>
            <div class="text-end" style="width: 10%">
                ${amountStr}
            </div>
            <div class="text-end filled" style="width: 10%">
                ${data.filled}
            </div>
            <div class="text-end" style="width: 10%">
                ${data.total}
            </div>
            <div class="text-end" style="width: 11%">
                ${stopStr}
            </div>
            <div class="text-end" style="width: 8%">
                ${data.status}
            </div>
            
            <div class="col-8 m-3 inner">
                <div class="row">
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
                
                <div class="trades-in-order-data">
                    ${trades}
                </div>
            </div>
            
        </div>
    `;
}

function renderHistoryTrade(data, inOrder) {
    var time = new Date(data.time * 1000).toLocaleString();
    
    var inOrdClass = '';
    if(inOrder) inOrdClass = 'trade-in-order-item'
    
    var timeWPerc = 14;
    if(inOrder) timeWPerc = 18;
    
    var innerHtml = '';
    if(!inOrder) innerHtml = `
            <div style="width: 12%">
                ${data.pair}
            </div>
            <div style="width: 6%">
                ${data.side}
            </div>
        `;
    
    var html = `
        <div class="row hoverable ${inOrdClass}">
            <div style="width: ${timeWPerc}%">
                ${time}
            </div>
            ${innerHtml}
            <div class="text-end" style="width: 14%">
                ${data.price}
            </div>
            <div class="text-end" style="width: 14%">
                ${data.amount}
            </div>
            <div class="text-end" style="width: 14%">
                ${data.total}
            </div>
            <div class="text-end" style="width: 14%">
                ${data.fee}
            </div>
            <div class="text-end" style="width: 12%">
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
                thisAS.append(renderHistoryTrade(v, false));
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
    if(data.time_in_force == 'GTC')
        window.openOrdersAS.prepend(renderOpenOrder(data));
});

$(document).on('orderPartialFilled', function(e, data) {
    var ooItem = $('.orders-open-item[data-obid="' + data.obid + '"]');
    var filledPerc = Math.round(data.filled / ooItem.data('amount') * 100);
    ooItem.find('.filled').html(data.filled);
    ooItem.find('.filled-perc').html(filledPerc);
});
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
    
    var filledStr = '-';
    if(typeof(data.filled) !== 'undefined') {
        var filledPerc = Math.round(data.filled / data.amount * 100);
        filledStr = `${data.filled} (${filledPerc}%)`;
    }
    
    var stopStr = '';
    if(typeof(data.stop) !== 'undefined') {
        stopStr = data.stop + ' &rarr; ';
    }
    
    return `
        <div class="row orders-open-item" data-obid="${data.obid}">
            <div class="col-2">
                ${time}
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
                ${stopStr}${data.price}
            </div>
            <div class="col-2 text-end">
                ${data.amount}
            </div>
            <div class="col-2 text-end filled">
                ${filledStr}
            </div>
            <div class="col-2 text-end">
                ${total}
                <i class="fa-solid fa-xmark" onClick="cancelOrder(${data.obid})"></i>
            </div>
        </div>
    `;
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
    if(data.trades.length > 0) {
        expandBtn = '<i class="fa-solid fa-square-plus"></i> ';
    }
    
    var amountStr = '';
    if(typeof(data.amount) !== 'undefined') {
        amountStr = data.amount;
    }
    else {
        amountStr = 'Total: ' + data.total;
    }
    
    return `
        <div class="row orders-history-item" data-obid="${data.obid}">
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
        </div>
    `;
}

$(document).on('authChecked pairSelected', function() {
    if(typeof(window.multiEvents['authChecked']) == 'undefined' || typeof(window.multiEvents['pairSelected']) == 'undefined') return;
    
    if(window.loggedIn) {
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
    } else {
        $(document).trigger('renderingStage'); // 5
        $(document).trigger('renderingStage'); // 6
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
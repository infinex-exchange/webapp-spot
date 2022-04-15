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
            // notification
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
                ${data.price}
            </div>
            <div class="col-2 text-end">
                ${data.amount}
            </div>
            <div class="col-2 text-end filled">
                ${data.filled} (${filledPerc}%)
            </div>
            <div class="col-2 text-end">
                ${total}
                <i class="fa-solid fa-xmark" onClick="cancelOrder(${data.obid})"></i>
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
        
        $.ajax({
            url: config.apiUrl + '/spot/orders_history',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .done(function (data) {
            if(data.success) {    
                $(data.orders).each(function() {
                    var time = new Date(this.time).toLocaleTimeString();
                    thisAS.append(`    
                        <div class="row">
                            <div class="col">
                                ${time}
                            </div>
                            <div class="col">
                                ${this.pair}
                            </div>
                            <div class="col">
                                ${this.type}
                            </div>
                            <div class="col">
                                ${this.side}
                            </div>
                            <div class="col">
                                ${this.price}
                            </div>
                            <div class="col">
                                ${this.amount}
                            </div>
                            <div class="col">
                                ${this.filled}
                            </div>
                            <div class="col">
                                ${this.total}
                            </div>
                            <div class="col">
                                <i class="fa-solid fa-xmark" onClick="alert(1)"></i>
                            </div>
                        </div>
                    `);
                });
                
                $(document).trigger('renderingStage'); // 6
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {  
        }); 
    } else {
        $(document).trigger('renderingStage'); // 5
        $(document).trigger('renderingStage'); // 6
    }
});

$(document).on('orderCanceled orderFilled', function(e, data) {
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
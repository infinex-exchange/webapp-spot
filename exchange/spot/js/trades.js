function renderTradesItem(data) {
    var time = new Date(data.time * 1000).toLocaleTimeString();
    return `
        <div class="row">
            <div class="col-4">
                ${data.price}
            </div>
            <div class="col-4 text-end">
                ${data.amount}
            </div>
            <div class="col-4 text-end">
                ${time}
            </div>
        </div>
    `;
}

$(document).on('authChecked pairSelected', function() {
    if(typeof(window.multiEvents['authChecked']) == 'undefined' || typeof(window.multiEvents['pairSelected']) == 'undefined') return;
    
    window.marketTradesAS = new AjaxScroll(
            $('#trades-market-data'),
            $('#trades-market-preloader'),
            {
                pair: window.currentPair
            },
            function() {
                this.data.offset = this.offset;
                var thisAS = this;
            
            //---
    $.ajax({
        url: config.apiUrl + '/spot/trades',
        type: 'POST',
        data: JSON.stringify(thisAS.data),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $(data.trades).each(function() {
                thisAS.append(renderTradesItem(this));
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0) {
                window.wsClient.sub(
                    window.currentPair + '@marketTrade',
                    function(data) {
                        thisAS.prepend(renderTradesItem(data));
                    },
                    function(error) {
                        msgBoxRedirect(error);
                    }
                );
                
                $(document).trigger('renderingStage'); // 3
            }
            
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
    
    if(window.loggedIn) {
        $.ajax({
            url: config.apiUrl + '/spot/my_trades',
            type: 'POST',
            data: JSON.stringify({
                query: window.currentPair,
                api_key: window.apiKey
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .done(function (data) {
            if(data.success) {    
                $(data.trades).each(function() {
                    var time = new Date(this.time).toLocaleTimeString();
                    $('#trades-my-data').append(`
                        <div class="row">
                            <div class="col-4">
                                ${this.price}
                            </div>
                            <div class="col-4 text-end">
                                ${this.amount}
                            </div>
                            <div class="col-4 text-end">
                                ${time}
                            </div>
                        </div>
                    `);
                });
                
                $(document).trigger('renderingStage'); // 4
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {  
        });
    } else {
        $(document).trigger('renderingStage'); // 4
    }
});
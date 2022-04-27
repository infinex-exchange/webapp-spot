function renderTradesItem(data) {
    var time = new Date(data.time * 1000).toLocaleTimeString();
    
    var color = '';
    if(data.side == 'BUY') color = 'text-green';
    else color = 'text-red';
    
    return `
        <div class="trades-item row hoverable">
            <div class="col-4 ${color}">
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

$(document).on('pairSelected', function() { 
    window.marketTradesAS = new AjaxScroll(
            $('#trades-data'),
            $('#trades-preloader'),
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
});
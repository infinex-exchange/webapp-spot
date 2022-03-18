$(document).on('pairSelected', function() {
    $.ajax({
        url: config.apiUrl + '/spot/orderbook',
        type: 'POST',
        data: JSON.stringify({
            query: window.currentPair
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .done(function (data) {
        if(data.success) {
            data.bids = data.bids.slice(0, 20).reverse();
            data.asks = data.asks.slice(-20);
              
            $(data.bids).each(function() {
                var total = parseFloat(this.price * this.amount).toFixed(window.currentQuotePrecision);
                $('#orderbook-buy').append(`
                    <div class="row">
                        <div class="col-4 text-success">
                            ${this.price}
                        </div>
                        <div class="col-4 text-end">
                            ${this.amount}
                        </div>
                        <div class="col-4 text-end">
                            ${total}
                        </div>
                    </div>
                `);
            });
            
            $(data.asks).each(function() {
                var total = parseFloat(this.price * this.amount).toFixed(window.currentQuotePrecision);
                $('#orderbook-sell').append(`
                    <div class="row">
                        <div class="col-4 text-danger">
                            ${this.price}
                        </div>
                        <div class="col-4 text-end">
                            ${this.amount}
                        </div>
                        <div class="col-4 text-end">
                            ${total}
                        </div>
                    </div>
                `);
            });
            
            $(document).trigger('renderingStage'); // 7
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {  
    }); 
});
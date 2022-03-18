$(document).on('authChecked pairSelected', function() {
    if(typeof(window.multiEvents['authChecked']) == 'undefined' || typeof(window.multiEvents['pairSelected']) == 'undefined') return;

    $.ajax({
        url: config.apiUrl + '/spot/market_trades',
        type: 'POST',
        data: JSON.stringify({
            query: window.currentPair
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .done(function (data) {
        if(data.success) {    
            $(data.trades).each(function() {
                var time = new Date(this.time).toLocaleTimeString();
                $('#trades-market-data').append(`
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
            
            $(document).trigger('renderingStage'); // 3
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {  
    });
    
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
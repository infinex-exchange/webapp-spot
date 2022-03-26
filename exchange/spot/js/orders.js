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
            $(data.orders).each(function() {
                var time = new Date(this.time).toLocaleTimeString();
                $('#orders-open-data').append(`
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
                    $('#orders-history-data').append(`    
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
function gotoMarket(pair) {
    if(typeof(window.currentPair) !== 'undefined' && pair == window.currentPair)
        gotoUiCard('chart');
    else
        window.location.replace('/spot/' + pair.replace('/', '_'));
}

function filterMarketsByQuote(q) {
    window.defaultQuoteFilter = q;
    
    delete window.marketsAS.data.search;
    $('#markets-search').val('');
    
    window.marketsAS.data.quote = q;
    window.marketsAS.reset();
    
    $('.markets-filter-btn').removeClass('active');
    $('.markets-filter-btn[data-quote="' + q + '"]').addClass('active');
}

function liveMarketItem(data) {
    var div = $('.markets-item[data-pair="' + data.pair + '"]');
    
    var priceDiv = div.find('.price');
    var color = '';
    var bnCurrent = new BigNumber(data.price);
    var bnPrevious = new BigNumber(data.previous);
    var comp = bnCurrent.comparedTo(bnPrevious);
    if(comp == 1) color = 'text-green';
    else if(comp == -1) color = 'text-red';
    priceDiv.removeClass('text-green text-red');
    priceDiv.html(data.price);
    priceDiv.addClass(color);
    
    var changeDiv = div.find('.change');
    color = '';
    var changeStr = data.change;
    if(data.change > 0) {
        color = 'bg-green';
        changeStr = '+' + changeStr;
    }
    if(data.change < 0)
        color = 'bg-red';
    changeDiv.removeClass('bg-green bg-red');
    changeDiv.html(changeStr + '%');
    changeDiv.addClass(color);
}

function applySpotConfig(data) {
    $.each(data.quotes, function() {
        $('#markets-quotes').append(`
            <a class="markets-filter-btn nav-link" href="#_" data-quote="${this}"
                onClick="filterMarketsByQuote('${this}')">${this}</a>
        `);
    });
    
    window.defaultPair = data.default_pair;
    $(document).trigger('prePairSelected');
}

$(document).on('wsConnected', function() {   
    // Set rendering stages target
    
    window.renderingStagesTarget = 6; //9
    window.tickersSubscribed = new Array();
    
    // Set DOM event handlers
    
    $('#markets-search').on('input', function() {
        var query = $(this).val();
        if(query == '') {
            filterMarketsByQuote(window.defaultQuoteFilter);
        }
        else {
            $('.markets-filter-btn').removeClass('active');
            delete window.marketsAS.data.quote;
            window.marketsAS.data.search = query;
            window.marketsAS.reset();
        }  
    });
    
    // Create AjaxScroll but don't run it
    
    window.marketsAS = new AjaxScroll(
        $('#markets-table'),
        $('#markets-table-preloader'),
        {},
        function() {
            this.data.offset = this.offset;
            var thisAS = this;
            
            //---
    $.ajax({
        url: config.apiUrl + '/spot/markets',
        type: 'POST',
        data: JSON.stringify(thisAS.data),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            var sub = new Array();
            
            $.each(data.markets, function(k, v) {           
                thisAS.append(`
                    <div class="row hoverable markets-item flex-nowrap p-1" onClick="gotoMarket('${v.pair}')" data-pair="${v.pair}">
                        <div class="col-1 my-auto">
                            <img width="22" height="22" src="${v.icon_url}">
                        </div>
                        <div class="col-4 my-auto">
                            ${v.base}<span class="small secondary">/${v.quote}</span>
                        </div>
                        <div class="col-4 text-end price my-auto">
                        </div>
                        <div class="col-3 text-end my-auto">
                            <span class="change">
                            </span>
                        </div>
                    </div>
                `);
                
                liveMarketItem(v);
                
                sub.push(v.pair + '@ticker');
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0) {
                var unsub = new Array();
            
                for(var i = 0; i < window.tickersSubscribed.length; i++) {
                    var j = sub.indexOf(window.tickersSubscribed[i]);
                    
                    // We dont want to subscribe but it is subscribed
                    if(j === -1) {
                        unsub.push(window.tickersSubscribed[i]);
                        window.tickersSubscribed.splice(i, 1);
                        i--;
                    }
                    
                    // We want to subscribe but is already subscribed
                    else {
                        sub.splice(j, 1);
                    }
                }
                
                if(unsub.length) window.wsClient.unsub(
                    unsub,
                    function(error) {
                        msgBoxRedirect(error);
                    }
                );
            }                        
            
            if(sub.length) {
                window.tickersSubscribed = window.tickersSubscribed.concat(sub);
                window.wsClient.sub(
                    sub,
                    function(data) {
                        liveMarketItem(data);
                    },
                    function(error) {
                        msgBoxRedirect(error);
                    }
                );
            }
            
            if(typeof(thisAS.renderingStageTriggered) === 'undefined') {
                thisAS.renderingStageTriggered = true;
                $(document).trigger('renderingStage'); // 1                
            }                
            
            if(data.markets.length != 50)
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
        false // Don't run it
    );
    
    // Get quotes orders and default pair
    
    var lsConfig = localStorage.getItem("spotConfigCache");
    var lsConfigTimestamp = localStorage.getItem("spotConfigTimestamp")
    
    if(lsConfig !== null &&
       lsConfigTimestamp !== null &&
       lsConfigTimestamp > Date.now() - 604800000)
    {
        applySpotConfig(JSON.parse(lsConfig));
    }
    else { 
        $.ajax({
            url: config.apiUrl + '/spot/config',
            type: 'POST',
            data: JSON.stringify({}),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                localStorage.setItem("spotConfigCache", JSON.stringify(data));
                localStorage.setItem("spotConfigTimestamp", Date.now());
                applySpotConfig(data);
            }
            else {
                msgBoxRedirect(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(true); 
        });
    }
});

$(document).on('prePairSelected', function() {
    // Swipe left / right to filter by quote
    $('#markets-table').swipe({
        swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('.markets-filter-btn.active').next('.markets-filter-btn').trigger('click');
        },
        swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
            $('.markets-filter-btn.active').prev('.markets-filter-btn').trigger('click');
        },
        fallbackToMouseEvents: false
    });
});

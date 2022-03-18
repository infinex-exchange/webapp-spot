function gotoMarket(base, quote) {
    window.location.replace('/spot/' + base + '_' + quote);
}

function filterMarketsByQuoteInternal(q) {
    $('.markets-item').hide();
    $('.markets-item[quote=' + q + ']').show();
    $('.markets-filter-btn').removeClass('active');
    $('.markets-filter-btn[quote=' + q + ']').addClass('active');
    window.selectedQuote = q;
}

function filterMarketsByQuote(q) {
    filterMarketsByQuoteInternal(q);
    updateMarketsSub();
}

function searchMarkets(q) {
    if(q == '')
        filterMarketsByQuoteInternal(window.selectedQuote);
    else {
        q = q.replace(/[^a-z0-9]/gi, '');
        q = q.toUpperCase();
        $('.markets-item').hide();
        $('.markets-item[base *= "' + q + '"], .markets-item[quote *= "' + q + '"]').show();
    }
}

function updateMarketsSub() {
    if(typeof(window.marketsSub) == 'undefined') {
        window.marketsSub = [];
    }
    
    var sub = [];
    var unsub = [];
    
    $('.markets-item').each(function() {
        var pair = $(this).attr('name');
        
        if($(this).is(':visible')) {
            if(! window.marketsSub.includes(pair)) {
                sub.push(pair);
                window.marketsSub.push(pair);
            }
        } else {
            if(window.marketsSub.includes(pair)) {
                unsub.push(pair);
            }
        }
    });
    
    console.log({sub: sub, unsub: unsub});
}

$(document).ready(function() {
    window.renderingStagesTarget = 8;
    
    $('#markets-search').on('input', function() {
        searchMarkets($(this).val());
    });
    
    /*var timerId;
    $('#markets-table').on('scroll', function() {
        clearTimeout(timerId);
        timerId = setTimeout(function(){
            updateMarketsSub();          
        }, 200);
    });*/
    
    $.ajax({
        url: config.apiUrl + '/spot/tickers',
        type: 'POST',
        data: JSON.stringify({}),
        contentType: "application/json",
        dataType: "json",
    })
    .done(function (data) {
        if(data.success) {
            $(data.tickers).each(function() {
                var splitArray = this.name.split('/');
                this.base = splitArray[0];
                this.quote = splitArray[1];
            });
            
            window.markets = data.tickers;
            $(document).trigger('marketsLoaded');
            
            var quotes = [];
            
            $(window.markets).each(function() {  
                if(quotes.indexOf(this.quote) == -1) {
                    quotes.push(this.quote);
                    $('#markets-quotes').append(`
                        <a class="markets-filter-btn nav-link" href="#" quote="${this.quote}"
                        onClick="filterMarketsByQuote('${this.quote}')">${this.quote}</a>
                    `);
                }
                
                var color = '';
                if(this.change > 0) color = 'text-success';
                if(this.change < 0) color = 'text-danger';
                
                $('#markets-table').append(`
                    <div class="row markets-item" name="${this.name}" base="${this.base}" quote="${this.quote}"
                    onClick="gotoMarket('${this.base}', '${this.quote}')">
                        <div class="col-1">
                            <img width="16px" height="16px" src="${this.icon}">
                        </div>
                        <div class="col-3">
                            ${this.base}/${this.quote}
                        </div>
                        <div class="col-4 text-end">
                            ${this.price}
                        </div>
                        <div class="col-3 text-end">
                            <span class="${color}">
                                ${this.change}%
                            </span>
                        </div>
                    </div>
                `);
            });
            
            filterMarketsByQuote(quotes[0]);
            
            $(document).trigger('renderingStage'); // 1
            
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {  
    });
});

$(document).onFirst('marketsLoaded', function() {
    window.multiEvents['marketsLoaded'] = true;
});
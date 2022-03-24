function gotoMarket(pair) {
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

$(document).ready(function() {
    // Set rendering stages target
    
    window.renderingStagesTarget = 1; //8
    
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
            $.each(data.markets, function(k, v) {
                if(typeof(window.defaultPair) === 'undefined') {
                    window.currentPair = k;
                    $(document).trigger('prePairSelected');
                }
                  
                var color = '';
                if(v.change > 0) color = 'text-success';
                if(v.change < 0) color = 'text-danger';
                
                thisAS.append(`
                    <div class="row markets-item" onClick="gotoMarket('${k}')">
                        <div class="col-1">
                            <img width="16px" height="16px" src="${v.icon_url}">
                        </div>
                        <div class="col-3">
                            ${k}
                        </div>
                        <div class="col-4 text-end">
                            ${v.price}
                        </div>
                        <div class="col-3 text-end">
                            <span class="${color}">
                                ${v.change}%
                            </span>
                        </div>
                    </div>
                `);
            });
            
            thisAS.done();
            
            if(thisAS.offset == 0)
                $(document).trigger('renderingStage'); // 1
            
            if(data.markets.length != 25)
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
    
    // Get quotes list, then select first of them and run markets AjaxScroll
    
    $.ajax({
        url: config.apiUrl + '/spot/quotes',
        type: 'POST',
        data: JSON.stringify({}),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.quotes, function() {
                $('#markets-quotes').append(`
                    <a class="markets-filter-btn nav-link" href="#" data-quote="${this}"
                        onClick="filterMarketsByQuote('${this}')">${this}</a>
                `);
            });
            
            // Now it's time to run AjaxScroll
            filterMarketsByQuote(data.quotes[0]);
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true); 
    });
});
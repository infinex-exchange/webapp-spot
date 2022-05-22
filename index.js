function getMarketsForIndex(div, req) {
    $.ajax({
        url: config.apiUrl + '/spot/markets_ex',
        type: 'POST',
        data: JSON.stringify(req),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            div.empty();
            
            data.markets = data.markets.slice(0, 5);
            $.each(data.markets, function(k, v) {   
                var color = '';
                var changeStr = v.change;
                if(v.change > 0) {
                    color = 'text-green';
                    changeStr = '+' + changeStr;
                }
                if(v.change < 0)
                    color = 'text-red';
                
                div.append(`
                    <div class="row py-1 hoverable">
                        <div class="col-3 m-auto text-nowrap">
                            <img width="28" height="28" src="${v.icon_url}">
                            ${v.pair}
                        </div>
                        <div class="col-3 m-auto text-end">
                            ${v.price} ${v.quote}
                        </div>
                        <div class="col-3 m-auto text-end">
                            <span class="${color}">
                                ${changeStr}%
                            </span>
                        </div>
                        <div class="col-3 m-auto text-end">
                            ${v.vol_quote} ${v.quote}
                        </div>
                    </div>
                `);
            }); 
        }
        else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false); 
    });    
}

function indexUpdate() {
    getMarketsForIndex($('#market-trend-spot-data'), {
        offset: 0,
        sort: 'marketcap',
        sort_dir: 'desc'
    });
    
    getMarketsForIndex($('#top-gainers-spot-data'), {
        offset: 0,
        sort: 'change',
        sort_dir: 'desc'
    });
    
    getMarketsForIndex($('#top-losers-spot-data'), {
        offset: 0,
        sort: 'change',
        sort_dir: 'asc'
    });
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
    
    indexUpdate();
    setInterval(indexUpdate, 5000);
});
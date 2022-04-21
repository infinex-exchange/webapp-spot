$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
    
    $.ajax({
        url: config.apiUrl + '/spot/markets_ex',
        type: 'POST',
        data: JSON.stringify({
            offset: 0,
            quote: 'USDT',
            sort: 'marketcap',
            sort_dir: 'desc'
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            data.markets = data.markets.slice(0, 5);
            $.each(data.markets, function(k, v) {   
                var color = '';
                if(v.change > 0) color = 'text-green';
                if(v.change < 0) color = 'text-red';
                
                $('#market-trend-spot-data').append(`
                    <div class="row py-1 hoverable">
                        <div class="col-3 m-auto text-nowrap">
                            <img width="32" height="32" src="${v.icon_url}">
                            ${v.pair}
                        </div>
                        <div class="col-3 m-auto text-end">
                            ${v.price} ${v.quote}
                        </div>
                        <div class="col-3 m-auto text-end">
                            <span class="${color}">
                                ${v.change}%
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
});
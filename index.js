$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
    
    $.ajax({
        url: config.apiUrl + '/spot/markets_ex',
        type: 'POST',
        data: JSON.stringify({
            offset: 0
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.markets, function(k, v) {   
                var color = '';
                if(v.change > 0) color = 'text-success';
                if(v.change < 0) color = 'text-danger';
                
                $('#market-trend-spot-data').append(`
                    <div class="row p-2 hoverable">
                        <div class="col-3 m-auto">
                            <img width="32px" height="32px" src="${v.icon_url}">
                            ${k}
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
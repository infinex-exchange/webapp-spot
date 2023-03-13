function loadSpotMarkets(assetid, quote = false, offset = 0) {
	if(offset == 0)
		$('#mt-spot-data').html('');
	
	search = assetid;
	if(quote) search = '/' + search;
	else search = search + '/';
		
	$.ajax({
        url: config.apiUrl + '/spot/markets',
        type: 'POST',
        data: JSON.stringify({
	        search: search,
	        offset: offset
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(!data.success) {
            msgBox(data.error);
            return;
        }
        
        $.each(data.markets, function(k, v) {           
            $('#mt-spot-data').append(`
                <div class="row hoverable flex-nowrap p-1" onClick="gotoMarket('${v.pair}')">
                    <div class="col-1 my-auto">
                        <img width="22" height="22" src="${v.icon_url}">
                    </div>
                    <div class="col-11 my-auto">
                        ${v.base}<span class="small secondary">/${v.quote}</span>
                    </div>
                </div>
            `);
        });
        
        if(data.markets.length == 50)
	        loadSpotMarkets(assetid, quote, offset + 50);
	    else if(!quote)
		    loadSpotMarkets(assetid, true);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function showTrade(assetid) {
	loadSpotMarkets(assetid);
    
    $('#modal-trade').modal('show');
}
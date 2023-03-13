function loadSpotMarkets(assetid, offset = 0) {
	if(offset == 0)
		$('#mt-spot-data').html('');
		
	$.ajax({
        url: config.apiUrl + '/spot/markets',
        type: 'POST',
        data: JSON.stringify({
	        search: assetid,
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
	        if(v.base_assetid != assetid && v.quote_assetid != assetid)
		        return;
            
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
	        loadSpotMarkets(assetid, offset + 50);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function showTrade(assetid) {
	var modal = $('#modal-trade');
	
	loadSpotMarkets(assetid);
    
    modal.find('.modal-title').html('Trade ' + assetid);
    modal.modal('show');
}
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
	        if(v.base != assetid && v.quote != assetid)
		        return;
            
            $('#mt-spot-data').append(`
                <div class="col-6 col-lg-4 my-auto">
                    <div class="row hoverable flex-nowrap p-1" onClick="gotoMarket('${v.pair}')">
                        <div class="col-auto me-0 my-auto">
                            <img width="22" height="22" src="${v.icon_url}">
                        </div>
                        <div class="col-auto ms-0 my-auto">
                            ${v.base}<span class="small secondary">/${v.quote}</span>
                        </div>
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

function showTrade(assetid, event = null) {
    if(event)
        event.stopPropagation();
    
	var modal = $('#modal-trade');
	
	loadSpotMarkets(assetid);
    
    modal.find('.modal-title').html('Trade ' + assetid);
    modal.modal('show');
}
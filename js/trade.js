function loadMarkets(xchg, assetid, offset = 0) {
	if(offset == 0)
		$('#mt-' + xchg + '-data').html('');
		
	$.ajax({
        url: config.apiUrl + '/' + xchg + '/markets',
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
            
            $('#mt-' + xchg + '-data').append(`
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
	        loadMarkets(xchg, assetid, offset + 50);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function showTrade(assetid, event = null) {
    if(event)
        event.stopPropagation();
    
	var modal = $('#modal-trade');
	
	loadMarkets('spot', assetid);
	loadMarkets('dex', assetid);
    
    modal.find('.modal-title').html('Trade ' + assetid);
    modal.modal('show');
}
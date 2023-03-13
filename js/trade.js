function loadSpotMarkets(assetid, offset = 0) {
	if(offset == 0) {
		$('#mt-spot-data').html('');
        $('#mt-spot-header').addClass('d-none');
    }
		
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
                <div class="col-6 col-lg-4 my-auto p-0">
                    <a href="#_" class="text-reset text-decoration-none">
                    <div class="row background hoverable flex-nowrap p-2 m-1" onClick="gotoSpotMarket('${v.pair}')">
                        <div class="col-auto my-auto">
                            <img width="22" height="22" src="${v.icon_url}">
                        </div>
                        <div class="col-auto ps-0 my-auto">
                            ${v.base}<span class="small secondary">/${v.quote}</span>
                        </div>
                    </div>
                    </a>
                </div>
            `);
        });
        
        if(data.markets.length != 0 && offset == 0)
            $('#mt-spot-header').removeClass('d-none');
        
        if(data.markets.length == 50)
	        loadSpotMarkets(assetid, offset + 50);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function loadDexMarkets(netid, assetid, offset = 0) {
	if(offset == 0) {
		$('#mt-dex-' + netid + '-data').html('');
        $('#mt-dex-' + netid + '-header').addClass('d-none');
    }
		
	$.ajax({
        url: config.apiUrl + '/dex/markets',
        type: 'POST',
        data: JSON.stringify({
	        search: assetid,
	        offset: offset,
            network: netid
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
            
            $('#mt-dex-' + netid + '-data').append(`
                <div class="col-6 col-lg-4 my-auto p-0">
                    <a href="#_" class="text-reset text-decoration-none">
                    <div class="row background hoverable flex-nowrap p-2 m-1" onClick="gotoDexMarket('${netid}', '${v.pair}')">
                        <div class="col-auto my-auto">
                            <img width="22" height="22" src="${v.icon_url}">
                        </div>
                        <div class="col-auto ps-0 my-auto">
                            ${v.base}<span class="small secondary">/${v.quote}</span>
                        </div>
                    </div>
                    </a>
                </div>
            `);
        });
        
        if(data.markets.length != 0 && offset == 0)
            $('#mt-dex-' + netid + '-header').removeClass('d-none');
        
        if(data.markets.length == 50)
	        loadDexMarkets(netid, assetid, offset + 50);
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
    for(dex of window.dexes)
        loadDexMarkets(dex, assetid);
    
    modal.find('.modal-title').html('Trade ' + assetid);
    modal.modal('show');
}

$(document).ready(function() {
    window.dexes = [];
    
	$.ajax({
        url: config.apiUrl + '/dex/networks',
        type: 'POST',
        data: JSON.stringify({}),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(!data.success) {
            msgBox(data.error);
            return;
        }
        
        $.each(data.networks, function(k, v) {
            window.dexes.push(k);
            
            $('#mt-dex-container').append(`
                <div id="mt-dex-${k}-header" class="row pb-2 d-none">
                    <h5 class="secondary">${v.description} DEX markets:</h5>
                </div>
	            <div class="row" id="mt-dex-${k}-data">
	            </div>
            `);
        });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
});
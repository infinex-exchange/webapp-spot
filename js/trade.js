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
        
        found = 0;
        
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
            
            found++;
        });
        
        if(found != 0 && offset == 0)
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
        
        found = 0;
        
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
            
            found++;
        });
        
        if(found && offset == 0)
            $('#mt-dex-' + netid + '-header').removeClass('d-none');
        
        if(data.markets.length == 50)
	        loadDexMarkets(netid, assetid, offset + 50);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function loadP2PFiats(offset = 0) {
	if(offset == 0)
        window.fiats = [];
		
	$.ajax({
        url: config.apiUrl + '/p2p/fiats',
        type: 'POST',
        data: JSON.stringify({
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
        
        $.each(data.fiats, function(k, v) {
            $('#mt-p2p-data').append(`
                <div class="col-6 col-lg-4 my-auto p-0">
                    <a href="#_" class="text-reset text-decoration-none">
                    <div class="row background hoverable flex-nowrap p-2 m-1" onClick="gotoSpotMarket('')">
                        <div class="col-auto my-auto">
                            <div class="bg-white d-flex align-items-center justify-content-center rounded-circle" style="width: 24px; height: 24px; color: black;">
                                <strong>${v.symbol}</strong>
                            </div>
                        </div>
                        <div class="col-auto ps-0 my-auto">
                            <span class="mt-p2p-asset"></span><span class="small secondary">/${k}</span>
                        </div>
                    </div>
                    </a>
                </div>
            `);
        });
        
        if(data.fiats.length == 50)
	        loadP2PFiats(offset + 50);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });
}

function loadP2PMarkets(assetid) {
    $('#mt-p2p-container').addClass('d-none');
    
	$.ajax({
        url: config.apiUrl + '/p2p/assets',
        type: 'POST',
        data: JSON.stringify({
	        symbols: [ assetid ]
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $('.mt-p2p-asset').html(assetid);
            $('#mt-p2p-container').removeClass('d-none');
        }
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
    loadP2PMarkets(assetid);
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
                <div id="mt-dex-${k}-header" class="row py-2 d-none">
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
    
    loadP2PFiats();
});
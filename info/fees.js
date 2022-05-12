$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $.ajax({
        url: config.apiUrl + '/info/spot_fees',
        type: 'POST',
        data: JSON.stringify({
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.fees, function(level, data) {   
                $('#spot-fees-data').append(`
                    <div class="row p-2 hoverable">
                        <div class="col">
                            ${level}
                        </div>
                        <div class="col text-end">
                            &ge; ${data.volume} ${data.volume_asset}
                        </div>
                        <div class="col text-end">
                            &ge; ${data.hold} ${data.hold_asset}
                        </div>
                        <div class="col text-end">
                            ${data.maker_fee}%
                        </div>
                        <div class="col text-end">
                            ${data.taker_fee}%
                        </div>
                    </div>
                `);
            });
            
            $(document).trigger('renderingStage'); 
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true); 
    });
    
    $.ajax({
        url: config.apiUrl + '/info/withdrawal_fees',
        type: 'POST',
        data: JSON.stringify({
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.fees, function(k, asset) {
                var showAsset = true;
                
                $.each(asset.networks, function(k, network) {
                    var assetStr = '';
                    if(showAsset) {
                        assetStr = asset.asset;
                        showAsset = false;
                    }
                       
                    $('#withdrawal-fees-data').append(`
                        <div class="row p-2 hoverable">
                            <div class="col">
                                ${assetStr}
                            </div>
                            <div class="col">
                                ${network.network_description}
                            </div>
                            <div class="col text-end">
                                0
                            </div>
                            <div class="col text-end">
                                ${network.fee}
                            </div>
                        </div>
                    `);
                });
            });
            
            $(document).trigger('renderingStage'); 
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true); 
    });        
});
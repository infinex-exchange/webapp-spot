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
                        <div class="col-1 d-none d-lg-block">
                            <span class="d-none d-lg-inline">${level}</span>
                            <h3 class="d-lg-none m-auto">${level}</h3>
                        </div>
                        <div class="col-11">
                            <div class="row">
                                <div class="col-6 d-lg-none">
                                    <h5 class="secondary">30d trade volume:</h5>
                                </div>
                                <div class="col-6 col-lg text-end">
                                    &ge; ${data.volume} ${data.volume_asset}
                                </div>
                                <div class="col-6 d-lg-none">
                                    <h5 class="secondary">Hold:</h5>
                                </div>
                                <div class="col-6 col-lg text-end">
                                    &ge; ${data.hold} ${data.hold_asset}
                                </div>
                                <div class="col-6 d-lg-none">
                                    <h5 class="secondary">Maker fee:</h5>
                                </div>
                                <div class="col-6 col-lg text-end">
                                    ${data.maker_fee}%
                                </div>
                                <div class="col-6 d-lg-none">
                                    <h5 class="secondary">Taker fee:</h5>
                                </div>
                                <div class="col-6 col-lg text-end">
                                    ${data.taker_fee}%
                                </div>
                            </div>
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
                            <div class="col text-end d-none d-lg-block">
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
$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    $.ajax({
        url: config.apiUrl + '/spot/fees',
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
                $('#fees-data').append(`
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
                        <div class="col">
                            ${data.maker_fee}%
                        </div>
                        <div class="col">
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
});
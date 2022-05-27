$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    window.spotRulesAS = new AjaxScroll(
        $('#spot-rules-data'),
        $('#spot-rules-data-preloader'),
        {},
        function() {
            this.data.offset = this.offset;
            var thisAS = this;
    
            $.ajax({
                url: config.apiUrl + '/spot_markets',
                type: 'POST',
                data: JSON.stringify(thisAS.data),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(data.success) {
                    $.each(data.rules, function(k, v) { 
                        thisAS.append(`
                            <div class="row p-2 hoverable">
                                <div class="col-1 d-none d-lg-block">
                                    ${level}
                                </div>
                                <div class="col-1 d-lg-none my-auto text-center">
                                    Lvl
                                    <h3>${level}</h3>
                                </div>
                                <div class="col-11">
                                    <div class="row">
                                        <div class="col-6 d-lg-none secondary">
                                            30d trade volume:
                                        </div>
                                        <div class="col-6 col-lg text-end">
                                            &ge; ${data.volume} ${data.volume_asset}
                                        </div>
                                        <div class="col-6 d-lg-none secondary">
                                            Hold:
                                        </div>
                                        <div class="col-6 col-lg text-end">
                                            &ge; ${data.hold} ${data.hold_asset}
                                        </div>
                                        <div class="col-6 d-lg-none secondary">
                                            Maker fee:
                                        </div>
                                        <div class="col-6 col-lg text-end">
                                            ${data.maker_fee}%
                                        </div>
                                        <div class="col-6 d-lg-none secondary">
                                            Taker fee:
                                        </div>
                                        <div class="col-6 col-lg text-end">
                                            ${data.taker_fee}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);
                    });
                    
                    thisAS.done();
                    
                    if(thisAS.offset == 0)
                        $(document).trigger('renderingStage');
                       
                    if(data.rules.length != 50)
                        thisAS.noMoreData(); 
                }
                else {
                    msgBoxRedirect(data.error);
                    thisAS.done();
                    thisAS.noMoreData();
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                msgBoxNoConn(true);
                thisAS.done();
                thisAS.noMoreData(); 
            });
        }
    );        
});
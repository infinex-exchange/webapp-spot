$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('#asset-search').on('input', function() {
        var query = $(this).val();
        if(query == '')
            delete window.assetAS.data.search;
        else
            window.assetAS.data.search = query;
        window.assetAS.reset();
    });
    
    $('#asset-hide-zero').change(function() {
        var elements = $('#asset-data').find('[zero="1"]');
        
        if($(this).prop('checked'))
            elements.hide();
        else
            elements.show();
    });
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        window.assetAS = new AjaxScroll(
            $('#asset-data'),
            $('#asset-data-preloader'),
            {
                api_key: window.apiKey
            },
            function() {
                
                //---
                this.data.offset = this.offset;
                var thisAS = this;
                
                $.ajax({
                    url: config.apiUrl + '/wallet/balances_ex',
                    type: 'POST',
                    data: JSON.stringify(thisAS.data),
                    contentType: "application/json",
                    dataType: "json",
                })
                .retry(config.retry)
                .done(function (data) {
                    if(data.success) {
                        $.each(data.balances, function(k, v) {
                            zero = 0;
                            if(v.total == '0') zero = 1;
                            
                            thisAS.append(`
                                <div class="assets-item row p-1 hoverable" zero="${zero}">
                                    <div class="col-1 my-auto">
                                        <img width="40px" height="40px" src="${v.icon_url}">
                                    </div>
                                    <div class="col-2 my-auto">
                                        ${k}<br>
                                        <span class="small">${v.name}</span>
                                    </div>
                                    <div class="col-2 text-end my-auto">
                                        ${v.total} ${k}
                                    </div>
                                    <div class="col-2 text-end my-auto">
                                        ${v.avbl} ${k}
                                    </div>
                                    <div class="col-2 text-end my-auto">
                                        ${v.locked} ${k}
                                    </div>
                                    <div class="col-3 my-auto">
                                        <a href="/wallet/deposit/${k}" class="btn btn-primary btn-sm">Deposit</a>
                                        <a href="/wallet/withdraw/${k}" class="btn btn-primary btn-sm">Withdraw</a>
                                    </div>
                                </div>
                            `);
                        });
                        
                        thisAS.done();
                
                        if(thisAS.offset == 0)
                            $(document).trigger('renderingStage');
                            
                        if(data.balances.length != 25)
                            thisAS.noMoreData();
                    } else {
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
                //---
                
            }
        );
        
        initRecentTx({
            api_key: window.apiKey
        });
    }
});
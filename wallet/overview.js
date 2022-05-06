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
        $('#asset-data').toggleClass('hide-zero')
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
                            zero = '';
                            if(v.total == '0') zero = 'zero';
                            
                            thisAS.append(`
                                <div class="assets-item row p-1 hoverable ${zero}">
                                    <div class="my-auto" style="width: 60px">
                                        <img width="40px" height="40px" src="${v.icon_url}">
                                    </div>
                                    <div class="my-auto m-50-minus" style="width: calc(20% - 60px)">
                                        ${k}<br>
                                        <span class="small">${v.name}</span>
                                    </div>
                                    <div class="text-end my-auto d-none d-lg-block" style="width: 19%">
                                        ${v.total} ${k}
                                    </div>
                                    <div class="text-end my-auto m-50-percent" style="width: 19%">
                                        ${v.avbl}<span class="d-none d-lg-inline"> ${k}</span>
                                    </div>
                                    <div class="text-end my-auto d-none d-lg-block" style="width: 18%">
                                        ${v.locked} ${k}
                                    </div>
                                    <div class="my-auto d-none d-lg-block" style="width: 24%">
                                        <a href="/wallet/deposit/${k}" class="btn btn-primary btn-sm">Deposit</a>
                                        <a href="/wallet/withdraw/${k}" class="btn btn-primary btn-sm">Withdraw</a>
                                    </div>
                                </div>
                            `);
                        });
                        
                        thisAS.done();
                
                        if(thisAS.offset == 0)
                            $(document).trigger('renderingStage');
                            
                        if(data.balances.length != 50)
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
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
                                <div class="assets-item row p-1 hoverable ${zero}" onClick="mobileAssetDetails(this)"
                                data-icon="${v.icon_url}" data-symbol="${k}" data-name="${v.name}"
                                data-total="${v.total}" data-avbl="${v.avbl}" data-locked="${v.locked}">
                                    <div class="my-auto" style="width: 60px">
                                        <img width="40" height="40" src="${v.icon_url}">
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
                                        <a href="/wallet/deposit/${k}" class="link-ultra">Deposit</a>
                                        <a href="/wallet/withdraw/${k}" class="link-ultra">Withdraw</a>
                                        <a href="/wallet/transfer/${k}" class="link-ultra">Transfer</a>
                                        <a href="#_" class="link-ultra">Trade</a>
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
        
        var txHistoryData = {
            api_key: window.apiKey
        };
        initTxHistory($('#recent-tx-data'), $('#recent-tx-preloader'), txHistoryData, true, true);
    }
});

function mobileAssetDetails(item) {
    if($(window).width() > 991) return;
    
    $('#mad-icon').attr('src', $(item).data('icon'));
    $('#mad-name').html($(item).data('name'));
    $('#mad-total').html($(item).data('total') + ' ' + $(item).data('symbol'));;
    $('#mad-avbl').html($(item).data('avbl') + ' ' + $(item).data('symbol'));
    $('#mad-locked').html($(item).data('locked') + ' ' + $(item).data('symbol'));
    $('#mad-deposit').attr('href', '/wallet/deposit/' + $(item).data('symbol'));
    $('#mad-withdraw').attr('href', '/wallet/withdraw/' + $(item).data('symbol'));
    
    $('#modal-mobile-asset-details').modal('show');
}
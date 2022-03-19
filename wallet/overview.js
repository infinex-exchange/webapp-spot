var txTypeIconDict = {
    DEPOSIT: 'fa-solid fa-circle-plus',
    WITHDRAWAL: 'fa-solid fa-circle-minus',
};

var txTypeDict = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRADE_SPOT: 'Spot trade'
};

var txStatusIconDict = {
    PENDING: 'fa-solid fa-clock',
    DONE: 'fa-solid fa-check'
};

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
                            if(v.total.startsWith('0.')) zero = 1;
                            
                            thisAS.append(`
                                <div class="assets-item row p-1 hoverable" zero="${zero}">
                                    <div class="col-1 my-auto">
                                        <img width="40px" height="40px" src="${v.icon_url}">
                                    </div>
                                    <div class="col-2 my-auto">
                                        ${k}<br>
                                        <span class="font-1">${v.name}</span>
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
                                        <a href="/wallet/deposit/${k}" class="btn btn-primary btn-sm font-1">Deposit</a>
                                        <a href="/wallet/withdraw/${k}" class="btn btn-primary btn-sm font-1">Withdraw</a>
                                    </div>
                                </div>
                            `);
                        });
                        
                        thisAS.done();
                
                        if(thisAS.offset == 0)
                            $(document).trigger('renderingStage');
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
        
    
        $.ajax({
            url: config.apiUrl + '/wallet/transactions',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                offset: 0
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                $.each(data.transactions, function() {
                    var innerhtml = '';
                    var amount = '';
                    var innerhtml2 = `
                        <span class="text-hi">Time:</span> ${this.creation_date}
                    `;
                
                    if(this.type == 'TRADE_SPOT') {
                        innerhtml = `
                            <div style="position: relative">
                                <img width="20" height="20" src="${this.icon_url}">
                                <img style="position: absolute; top: 20px; left: 20px;" width="20" height="20" src="${this.opposite_icon_url}">
                                <img style="position: absolute; top: 0px; left: 20px; transform: scaleX(-1) rotate(90deg);" src="/img/swap_arrow.svg" width="20" height="20">
                                <img style="position: absolute; top: 20px; left: 0px;" src="/img/swap_arrow.svg" width="20" height="20">
                            </div>
                        `;
                        amount = this.amount + ' ' + this.asset + ' <i class="fa-solid fa-arrow-right-long"></i> '
                            + this.opposite_amount + ' ' + this.opposite_asset;
                        innerhtml2 += `
                            <br>
                            <span class="text-hi">Avg price:</span> ${this.avg_price}
                        `;
                    }
                    else {
                        innerhtml = `
                            <div class="p-2" style="position: relative">
                                <img width="40" height="40" src="${this.icon_url}">
                                <div style="position: absolute; bottom: 0px">
                                    <i style="font-size: 16px; color: var(--color-ultra);" class="${txTypeIconDict[this.type]}"></i>
                                </div>
                            </div>
                        `;
                        amount = this.amount + ' ' + this.asset;
                        if(this.type == 'DEPOSIT') {
                            innerhtml2 += `
                                <br>
                                <span class="text-hi">Confirmations:</span> ${this.confirms}/${this.confirms_target}
                            `;
                        }
                        if(typeof(this.txid) !== 'undefined') {
                            var txiduser = showTxid(this.txid);
                            innerhtml2 += `
                                <br>
                                <span class="text-hi">TxID:</span> ${txiduser}
                            `;
                        }
                    }
            
                    $('#recent-tx-data').append(`
                        <div class="row p-1 hoverable hover-to-expand">
                            <div class="col-2 my-auto">
                                ${innerhtml}
                            </div>
                            <div class="col-8 my-auto">
                                <span class="text-hi">${txTypeDict[this.type]}</span><br>
                                <span class="font-1">${amount}</span>
                            </div>
                            <div class="col-2 my-auto">
                                <i class="${txStatusIconDict[this.status]}"></i>
                            </div>
                            <div class="col-2 expand"></div>
                            <div class="col-8 expand font-1">
                                ${innerhtml2}
                            </div>
                            <div class="col-2 expand"></div>
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
    }
});
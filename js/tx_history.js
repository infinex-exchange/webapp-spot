var txTypeIconDict = {
    DEPOSIT: 'fa-solid fa-circle-plus',
    WITHDRAWAL: 'fa-solid fa-circle-minus',
};

var txTypeDict = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal'
};

var txStatusIconDict = {
    PENDING: 'fa-solid fa-clock',
    DONE: 'fa-solid fa-check'
};

function mobileTxDetails(item, forceSmall) {
    if($(window).width() > 991 && !forceSmall) return;
    
    $('#mad-icon').attr('src', $(item).data('icon'));
    $('#mad-name').html($(item).data('name'));
    $('#mad-total').html($(item).data('total') + ' ' + $(item).data('symbol'));;
    $('#mad-avbl').html($(item).data('avbl') + ' ' + $(item).data('symbol'));
    $('#mad-locked').html($(item).data('locked') + ' ' + $(item).data('symbol'));
    $('#mad-deposit').attr('href', '/wallet/deposit/' + $(item).data('symbol'));
    $('#mad-withdraw').attr('href', '/wallet/withdraw/' + $(item).data('symbol'));
    
    $('#modal-mobile-tx-details').modal('show');
}

function renderTxHistoryItem(data, forceSmall) { 
    return `
        <div class="row hoverable tx-history-item px-1 py-2 py-lg-1" onClick="mobileTxDetails(this, ${forceSmall})">
            <div class="col-2 my-auto">
                <div class="p-2" style="position: relative">
                    <img width="40" height="40" src="${data.icon_url}">
                    <div style="position: absolute; bottom: 0px">
                        <i style="font-size: 16px; color: var(--color-ultra);" class="${txTypeIconDict[data.type]}"></i>
                    </div>
                </div>
            </div>
            
            <div class="col-8 my-auto">
                <span>${txTypeDict[data.type]}</span>
                <br>
                <span>${data.amount} ${data.asset}</span>
            </div>
            
            <div class="col-2 my-auto">
                <i class="${txStatusIconDict[data.status]}"></i>
            </div>
        </div>
    `;
}

function initTxHistory(container, preloader, data, forceSmall) {
    var scrollable = container.hasClass('scrollable');
    
    window.TxHistoryAS = new AjaxScroll(
        container,
        preloader,
        data,
        function() {
            this.data.offset = this.offset;
            var thisAS = this;
                
            $.ajax({
                url: config.apiUrl + '/wallet/transactions',
                type: 'POST',
                data: JSON.stringify(thisAS.data),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(data.success) {
                    $.each(data.transactions, function() {
                        thisAS.append(renderTxHistoryItem(this, forceSmall);
                    });
                    
                    thisAS.done();
                
                    if(thisAS.offset == 0)
                        $(document).trigger('renderingStage');
                        
                    if(data.transactions.length != 50 || !scrollable)
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
}
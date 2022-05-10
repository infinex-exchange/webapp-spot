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

function mobileTxDetails(item) {
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
    var dLgNone = 'd-lg-none';
    if(forceSmall) dLgNone = '';
    
    var dNoneDLgBlock = 'd-none d-lg-block';
    if(forceSmall) dNoneDLgBlock = 'd-none';
    
    var cTime = new Date(data.create_time * 1000).toLocaleString();
    
    var confHtml = '';
    var smallConfHtml = '';
    if(data.status != 'DONE' &&
       typeof(data.confirms) !== 'undefined' &&
       typeof(data.confirms_target) !== 'undefined')
    {
        confHtml = `<br><span class="secondary">${data.confirms}&nbsp;/&nbsp;${data.confirms_target}</span>`;
        smallConfHtml = `<span class="pe-2">${data.confirms}&nbsp;/&nbsp;${data.confirms_target}</span>`;
    }
    
    return `
        <div class="row hoverable tx-history-item px-1 py-2" onClick="mobileTxDetails(this)">
            
            
            
            
            <div class="my-auto ${dNoneDLgBlock}" style="width: 20%">
                ${cTime}
            </div>
            
            <div class=" my-auto ${dNoneDLgBlock}" style="width: 20%">
                ${data.type}
            </div>
            
            <div class="my-auto ${dNoneDLgBlock}" style="width: 20%">
                <img width="16" height="16" src="${data.icon_url}">
                ${data.asset}
            </div>
            
            <div class="text-end my-auto ${dNoneDLgBlock}" style="width: 20%">
                ${data.amount}
            </div>
            
            <div class="text-end my-auto ${dNoneDLgBlock}" style="width: 20%">
                <i class="${txStatusIconDict[data.status]}"></i>
                ${data.status}
                ${confHtml}
            </div>
            
            
            
            
            <div style="width: 60px" class="my-auto ${dLgNone}">
                <div class="p-2" style="position: relative">
                    <img width="40" height="40" src="${data.icon_url}">
                    <div style="position: absolute; bottom: 0px">
                        <i style="font-size: 16px; color: var(--color-ultra);" class="${txTypeIconDict[data.type]}"></i>
                    </div>
                </div>
            </div>
            
            <div style="width: 50%" class="my-auto ${dLgNone}">
                <h6 class="secondary">${txTypeDict[data.type]}</h6>
                <span>${data.amount} ${data.asset}</span>
            </div>
            
            <div style="width: calc(50% - 60px)" class="my-auto text-end ${dLgNone}">
                ${smallConfHtml}
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
                        thisAS.append(renderTxHistoryItem(this, forceSmall));
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
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
    $('#mtd-type').html( $(item).data('type') );
    $('#mtd-asset').html( $(item).data('asset') );
    $('#mtd-network').html( $(item).data('network') );
    $('#mtd-amount').html( $(item).data('amount') );
    $('#mtd-status').html( $(item).data('status') );
    $('#mtd-create-time').html( $(item).data('create-time') );
    $('#mtd-address').html( $(item).data('address') );
    $('#mtd-memo').html( $(item).data('memo') );
    $('#mtd-exec-time').html( $(item).data('exec-time') );
    $('#mtd-confirms').html( $(item).data('confirms') );
    $('#mtd-txid').html( $(item).data('txid') );
    $('#mtd-height').html( $(item).data('height') );
    $('#mtd-fee').html( $(item).data('fee') );
    $('#mtd-icon').attr('src', $(item).data('icon-url'));
    
    $('#modal-mobile-tx-details').modal('show');
}

function renderTxHistoryItem(data, forceSmall) { 
    var dLgNone = 'd-lg-none';
    if(forceSmall) dLgNone = '';
    
    var dNoneDLgBlock = 'd-none d-lg-block';
    if(forceSmall) dNoneDLgBlock = 'd-none';
    
    var cTime = new Date(data.create_time * 1000).toLocaleString();
    
    var confHtml = '';
    var bigConfHtml = '';
    var smallConfHtml = '';
    if(data.status != 'DONE' &&
       typeof(data.confirms) !== 'undefined' &&
       typeof(data.confirms_target) !== 'undefined')
    {
        confHtml = `${data.confirms}&nbsp;/&nbsp;${data.confirms_target}`;
        if(data.confirms != data.confirms_target) {
            bigConfHtml = '<br><span class="secondary">' + confHtml + '</span>'';
            smallConfHtml = '<span class="pe-2">' + confHtml + '</span>';
        }
    }
    
    return `
        <div class="row hoverable tx-history-item px-1 py-2" onClick="mobileTxDetails(this)"
         data-type="${data.type}" data-asset="${data.asset}" data-network="${data.network}"
         data-amount="${data.amount}" data-status="${data.status}" data-create-time="${data.create_time}"
         data-address="${data.address}" data-memo="${data.memo}" data-exec-time="${data.exec_time}"
         data-confirms="${confHtml}" data-txid="${data.txid}" data-height="${data.height}"
         data-fee="${data.fee}" data-icon-url="${data.icon_url}">
            
            
            
            
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
                    <div class="tx-history-icon-wrapper">
                        <i class="tx-history-icon ${txTypeIconDict[data.type]}"></i>
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
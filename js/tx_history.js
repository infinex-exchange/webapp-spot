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

var txExecTimeDict = {
    DEPOSIT: 'Confirm time',
    WITHDRAWAL: 'Execute time'
};

function mobileTxDetails(item) {
    var type = $(item).data('type');
    var status = $(item).data('status');
    var confirms = $(item).data('confirms');
    var memoName = $(item).data('memo-name');
    
    $('#mtd-icon').attr('src', $(item).data('icon-url'));
    $('#mtd-op-icon').removeClass()
                     .addClass('tx-history-icon')
                     .addClass(txTypeIconDict[type]);
    $('#mtd-asset').html( $(item).data('asset') );
    $('#mtd-type').html(txTypeDict[type]);
    $('#mtd-status').html(status);
    $('#mtd-status-icon').removeClass()
                         .addClass(txStatusIconDict[status]);
    if(confirms != '')
        $('#mtd-confirms').removeClass('d-none').addClass('d-block').html(confirms);
    else
        $('#mtd-confirms').removeClass('d-block').addClass('d-none').html('');
        
    $('#mtd-network').html( $(item).data('network') );
    $('#mtd-address').html( $(item).data('address') );
    if(memoName != '') {
        $('#mtd-memo').html( $(item).data('memo') );
        $('#mtd-memo-name').html(memoName);
        $('#mtd-memo-wrapper').show();
    }
    else {
        $('#mtd-memo-wrapper').hide();
    }
    
    $('#mtd-amount').html( $(item).data('amount') );
    $('#mtd-fee').html( $(item).data('fee') );
    
    $('#mtd-create-time').html( $(item).data('create-time') );
    $('#mtd-exec-time-title').html(txExecTimeDict[type] + ':');
    $('#mtd-exec-time').html( $(item).data('exec-time') );
    
    $('#mtd-txid').html( $(item).data('txid') );
    $('#mtd-height').html( $(item).data('height') );
    
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
            bigConfHtml = '<br><span class="secondary">' + confHtml + '</span>';
            smallConfHtml = '<span class="pe-2">' + confHtml + '</span>';
        }
    }
    
    var memoName = '';
    if(typeof(data.memo_name) !== 'undefined')
        memoName = data.memo_name;
    
    var memo = '-';
    if(typeof(data.memo) !== 'undefined')
        memo = data.memo;
    
    var eTime = '-';
    if(typeof(data.exec_time) !== 'undefined')
        eTime = new Date(data.exec_time * 1000).toLocaleString();
    
    var txid = '-';
    if(typeof(data.txid) !== 'undefined')
        txid = data.txid;
    
    var height = '-';
    if(typeof(data.height) !== 'undefined')
        height = data.height;
    
    return `
        <div class="row hoverable tx-history-item px-1 py-2" onClick="mobileTxDetails(this)"
         data-type="${data.type}" data-asset="${data.asset}" data-network="${data.network}"
         data-amount="${data.amount}" data-status="${data.status}" data-create-time="${cTime}"
         data-address="${data.address}" data-memo="${memo}" data-exec-time="${eTime}"
         data-confirms="${confHtml}" data-txid="${txid}" data-height="${height}"
         data-fee="${data.fee}" data-icon-url="${data.icon_url}" data-memo-name="${memoName}">
            
            
            
            
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
                ${bigConfHtml}
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

function initTxHistory(container, preloader, data, forceSmall = false, disableScroll = false) {
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
                        
                    if(data.transactions.length != 50 || disableScroll)
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
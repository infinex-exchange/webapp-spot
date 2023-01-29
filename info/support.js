function gotoStep(step) {
    $('.support-step').addClass('d-none');
    $('#' + step).removeClass('d-none');
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
    
    $('[data-goto]').click(function() {
        var datafor = $(this).data('for');
        if(typeof(datafor) !== 'undefined') {
            if(window.loggedIn && !datafor.includes('user')) {
                msgBox('This option cannot be used as a logged in user');
                return;
            }
            if(!window.loggedIn && !datafor.includes('guest')) {
                gotoLogin();
                return;
            }
        }
        
        gotoStep($(this).data('goto'));
    });
    
    $('#select-coin').on('change', function() {
        initSelectNet($('#select-coin').val());
    });
});

$(document).on('authChecked', function() {
    if(!window.loggedIn)
        return;
    
    initSelectCoin();
    
    $.ajax({
        url: config.apiUrl + '/wallet/transactions',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            offset: 0,
            type: 'WITHDRAWAL'
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.transactions, function(k, v) {
                if(v.status == 'CANCELED')
                    return;
                
                $('#sw-list').append(renderWithdrawal(v));
            });
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
});

function renderWithdrawal(data) { 
    var unixTime = data.create_time * 1000;
    var cTime = new Date(unixTime).toLocaleString();
    
    return `
        <div class="row hoverable withdrawal-item small p-1" data-xid="${data.xid}" data-asset="${data.asset}"
         data-network="${data.network}" data-address="${data.address}" data-time="${unixTime}" onClick="selectWithdrawal(this)">

            <div class="col-4">
                ${cTime}
            </div>
            
            <div class="col-4">
                ${data.amount}
                ${data.asset}
            </div>
            
            <div class="col-4">
                ${data.network_description}
            </div>
            
        </div>
    `;
}

function selectWithdrawal(item) {
    window.swXid = $(this).data('xid');
    window.swAsset = $(this).data('asset');
    window.swNetwork = $(this).data('network');
    window.swAddress = $(this).data('address');
    
    var then = new Date($(this).data('time'));
    alert(then);
    var now = new Date();
    
    var msBetweenDates = Math.abs(then.getTime() - now.getTime());
    var hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
    alert(hoursBetweenDates);
    
    if(hoursBetweenDates > 8)    
        gotoStep('support-withdrawal-gt8h');
    else
        gotoStep('support-withdrawal-gt8h');
}
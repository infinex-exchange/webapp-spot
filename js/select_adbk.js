$(document).ready(function() {
    $('#select-adbk').on('click', function(event) {
        $('#select-coin-dropdown').hide();
        $('#select-coin-arrow').removeClass('flip');
        $('#select-net-dropdown').hide();
        $('#select-net-arrow').removeClass('flip');
        $('#select-adbk-dropdown').toggle();
        $('#select-adbk-arrow').toggleClass('flip');
        event.stopPropagation();
    });
    
    $('#select-adbk').on('input', function() {
        $('#select-adbk-dropdown').hide();
        $('#select-adbk-arrow').removeClass('flip');
    });
    
    $('html').on('click', function() {
        $('#select-adbk-dropdown').hide();
        $('#select-adbk-arrow').removeClass('flip');
    });
});

function initSelectAdbk(asset, network) {
    $('#select-adbk-data').empty();
    
    $.ajax({
        url: config.apiUrl + '/wallet/addressbook',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            asset: asset,
            network: network
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.addressbook, function(k, v) {
                var memo = '';
                var memoHtml = '';
                if(typeof(v.memo) !== 'undefined') {
                    memo = v.memo;
                    memoHtml = '<br><i class="small secondary">' + v.memo + '</i>';
                }
                
                $('#select-adbk-data').append(`
                    <div class="select-adbk-item row p-1 hoverable" data-address="${v.address}" data-memo="${memo}">
                        <div class="col-12">
                            <strong>${v.name}</strong>
                            <br>
                            <span class="secondary">${v.address}</span>
                            ${memoHtml}
                        </div>
                    </div>
                `);
            });
                
            $('.select-adbk-item').on('click', function() {
                $('#select-adbk').val($(this).data('address')).trigger('input');
                if($(this).data('memo') != '')
                    $('#withdraw-memo').val($(this).data('memo')).trigger('input');
            });
        } else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
}
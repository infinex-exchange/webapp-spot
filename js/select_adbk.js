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
                $('#select-adbk-data').append(`
                    <div class="select-adbk-item row p-1 hoverable" data-address="${v.address}">
                        <div class="col-12">
                            <strong>${v.description}</strong>
                            <br>
                            <span class="secondary">${v.address}</span>
                        </div>
                    </div>
                `);
            });
                
            $('.select-adbk-item').on('click', function() {
                $('#select-adbk').val($(this).data('address')).trigger('input');
            });
        } else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
}
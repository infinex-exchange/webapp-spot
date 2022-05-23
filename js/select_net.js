$(document).ready(function() {
    $('#select-net').on('click', function(event) {
        $('#select-coin-dropdown').hide();
        $('#select-coin-arrow').removeClass('flip');
        $('#select-net-dropdown').toggle();
        $('#select-net-arrow').toggleClass('flip');
        $('#select-adbk-dropdown').hide();
        $('#select-adbk-arrow').removeClass('flip');
        event.stopPropagation();
    });
    
    $('html').on('click', function() {
        $('#select-net-dropdown').hide();
        $('#select-net-arrow').removeClass('flip');
    });
});

function initSelectNet(asset) {
    $('#select-net').val('');
    $('#select-net-data').empty();
    
    $.ajax({
        url: config.apiUrl + '/wallet/networks',
        type: 'POST',
        data: JSON.stringify({
            asset: asset
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $.each(data.networks, function(k, v) {
                $('#select-net-data').append(`
                    <div class="select-net-item row p-1 hoverable" data-network="${k}" data-description="${v.description}">
                        <div class="col-auto my-auto text-center" style="width: 32px">
                            <img width="24px" height="24px" src="${v.icon_url}">
                        </div>
                        <div class="col my-auto">
                            ${v.description}
                        </div>
                    </div>
                `);
            });
            
            $('#select-net').trigger('dataLoaded');
                
            $('.select-net-item').on('click', function() {
                $('#select-net').val($(this).attr('data-description'));
                $('#select-net').data('network', $(this).data('network'));
                $('#select-net').trigger('change');
            });
                
            if(Object.keys(data.networks).length == 1)
                $('.select-net-item').trigger('click');
        } else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
}
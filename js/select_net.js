$(document).ready(function() {
    $('#select-net').on('click', function(event) {
        $('#select-net-dropdown').toggle();
        $('#select-net-arrow').toggleClass('flip');
        $('#select-coin-dropdown').hide();
        $('#select-coin-arrow').removeClass('flip');
        event.stopPropagation();
    });
    
    $('html').on('click', function() {
        $('#select-net-dropdown').hide();
        $('#select-net-arrow').removeClass('flip');
    });
    
    $('#select-net').on('dataReady', function() {
        var items = $('.select-net-item');
        if(items.length == 1) {
            $(this).val($(items[0]).attr('data-description'));
            $(this).attr('data-network', $(items[0]).attr('data-network'));
            $(this).trigger('change');
        }
    });
});
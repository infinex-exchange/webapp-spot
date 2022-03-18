function showTxid(txid) {
    return txid.substr(0, 5) + '...' + txid.substr(-5);
}

$( document ).ready(function() {
    // Dropdown on hover
    $('.dropdown-on-hover').hover(function() {
        $(this).find('.dropdown-menu').addClass('show');
    },
    function() {
        $(this).find('.dropdown-menu').removeClass('show');
    }); 
    
    // Double borders
    /*$('.ui-card').each(function() {
        var thisOffset = $(this).offset();
        var rootOffset = $('#root').offset();
        if(thisOffset.left - rootOffset.left > 30) {
            $(this).css('border-left', 'none');
        }
    });*/
});
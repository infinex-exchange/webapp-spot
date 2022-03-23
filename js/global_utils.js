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
    
    // Auto active menu item
    $('.auto-active').each(function() {
        if(window.location.pathname.startsWith($(this).attr('href'))) {
            $(this).addClass('active');
            return;
        }
    });
});
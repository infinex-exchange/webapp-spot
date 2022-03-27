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
    
    // user-scalable=no not works on iOS
    document.addEventListener('dblclick', (event) => {
        event.preventDefault()
    }, { passive: false });
    
    // Mobile navbar
    $('.nav-link[data-ui-card]').on('click', function() {
        $('.ui-card[data-ui-card]').addClass('d-none');
        $('.ui-card[data-ui-card="' + $(this).attr('data-ui-card') + '"]').removeClass('d-none');
        $('.nav-link[data-ui-card]').removeClass('active');
        $('.nav-link[data-ui-card="' + $(this).attr('data-ui-card') + '"]').addClass('active');
    });
    $('.nav-link.active[data-ui-card]').trigger('click');
});
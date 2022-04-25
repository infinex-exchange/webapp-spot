function showTxid(txid) {
    return txid.substr(0, 5) + '...' + txid.substr(-5);
}

function gotoUiCard(card) {
    $('[data-ui-card]').addClass('d-none');
    $('[data-ui-card~="' + card + '"]').removeClass('d-none');
    $('.nav-link[data-ui-card-target]').removeClass('active');
    $('.nav-link[data-ui-card-target~="' + card + '"]').addClass('active');
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
    $('.nav-link[data-ui-card-target]').onFirst('click', function() {
        gotoUiCard($(this).attr('data-ui-card-target'));        
    });
    gotoUiCard( $('.nav-link.active[data-ui-card-target]').data('ui-card-target') );
});
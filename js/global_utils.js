function showTxid(txid) {
    return txid.substr(0, 5) + '...' + txid.substr(-5);
}

function gotoUiCard(card) {
    $('[data-ui-card]').addClass('d-none');
    $('[data-ui-card~="' + card + '"]').removeClass('d-none');
    $('.nav-link[data-ui-card-target]').removeClass('active');
    $('.nav-link[data-ui-card-target~="' + card + '"]').addClass('active');
}

function copyButton(t) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(
                $($(t).data('copy')).html()
            );
            var icon = $(t).find('.fa-copy');
            icon.removeClass('fa-copy').addClass('fa-check');
            setTimeout(function() {
                icon.removeClass('fa-check').addClass('fa-copy');
            }, 1000);
        }
}

$( document ).ready(function() {
    // Dropdown on hover
    $('.dropdown-on-hover').hover(function() {
        $(this).find('.dropdown-menu').addClass('show');
    },
    function() {
        $(this).find('.dropdown-menu').removeClass('show');
    });
    
    // Mobile navbar
    $('.nav-link[data-ui-card-target]').onFirst('click', function() {
        gotoUiCard($(this).attr('data-ui-card-target'));        
    });
    
    var urlCard = window.location.hash.substr(1);
    if($('[data-ui-card~="' + urlCard + '"]').length)
        gotoUiCard(urlCard);
    else
	    gotoUiCard( $('.nav-link.active[data-ui-card-target]').data('ui-card-target') );
    
    // Auto active menu item
    var loc = window.location.pathname;
    var aaCandidate = null;
    
    $('.auto-active').each(function() {
        var href = $(this).attr('href');
        
        if(aaCandidate == null ||
           (loc.startsWith(href) && href.length > $(aaCandidate).attr('href').length)
        ) {
            aaCandidate = this;
        }
    });
    
    if(aaCandidate != null) {
        $(aaCandidate).addClass('active');
        alert('cand '+$(aaCandidate).attr('href'));
    }
    
    $('.auto-active-group').each(function() {
        if($(this).parent().find('.auto-active.active').length !== 0)
            $(this).addClass('active');
    });
    
    // user-scalable=no not works on iOS
    document.addEventListener('dblclick', (event) => {
        event.preventDefault()
    }, { passive: false });
    
    // Copy button
    $('.copy-button').on('click', function() {
        copyButton(this);
    });
    
    // Range with value label
    $('.range-value').each(function() {
        var valItem = $(this);
        $('#' + $(this).attr('for')).on('input _input', function() {
            valItem.html($(this).val() + valItem.attr('suffix'));
            var left = $(this).val() / $(this).attr('max') * $(this).width() - (valItem.width() / 2);
            if(left < 0) left = 0;
            if(left > $(this).width() - valItem.width()) left = $(this).width() - valItem.width();
            valItem.css('left', left);
        }).trigger('input');
    });
    
    // Store refid
    var usp = new URLSearchParams(window.location.search);
    if(usp.has('r')) {
        var refid = usp.get('r');
        var date = new Date();
        var expires = date.getTime() + (3 * 24 * 60 * 60 * 1000);
        localStorage.setItem('refid', refid);
        localStorage.setItem('refid_expires', expires);
    }
});
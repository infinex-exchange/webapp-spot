function doJsSizing() {
    document.body.style.setProperty('--emulated-100vh', window.innerHeight + 'px');
    document.body.style.setProperty('--height-status-bar', $('#status-bar').outerHeight() + 'px');
    document.body.style.setProperty('--height-mobile-nav', $('#mobile-navbar').outerHeight() + 'px');
	document.body.style.setProperty('--height-trading-form', $('#trading-form').outerHeight() + 'px');
	document.body.style.setProperty('--height-mobile-header', $('#mobile-header').outerHeight() + 'px');
	document.body.style.setProperty('--height-main-nav', $('#main-navbar').outerHeight() + 'px');
    document.body.style.setProperty('--height-desktop-header', $('#desktop-header').outerHeight() + 'px');
    
    var obRemainH = $('#orderbook').height() - $('.orderbook-header').first().outerHeight() - $('#orderbook-middle').outerHeight();
    var obSideRemainH = obRemainH / 2;
    
    if(typeof(window.obItemH) == 'undefined') {
        window.obItemH = obItemH = $('.orderbook-item').first().outerHeight();
        if(typeof(window.obItemH) == 'undefined' || window.obItemH == 0)
            window.obItemH = 18;
    }

    var obTargetSideH = Math.round(obSideRemainH / window.obItemH) * window.obItemH;
    var obTargetSideHSm = Math.round(obRemainH / window.obItemH) * window.obItemH;
    document.body.style.setProperty('--target-height-orderbook-side', obTargetSideH + 'px');
    document.body.style.setProperty('--target-height-orderbook-side-sm', obTargetSideHSm + 'px');
    
    ['markets', 'trades'].forEach(function(i) {
        var remainH = $('#' + i).height() - $('#' + i + '-header').outerHeight();
        var itemH = $('.' + i + '-item').first().outerHeight();
        if(typeof(itemH) === 'undefined') itemH = 18;
        var targetH = Math.round(remainH / itemH) * itemH;
        document.body.style.setProperty('--target-height-' + i + '-data', targetH + 'px');
    });
    
    var remainH = $('#orders').height() - $('#orders-header').outerHeight();
    document.body.style.setProperty('--target-height-orders-data', remainH + 'px');
    
    $('#orderbook-sell').scrollTop(999999);
    $('#orderbook-buy').scrollTop(-999999);
}

$(document).on('renderingComplete', function() {
    doJsSizing();
});

$(window).resize(function() {
	doJsSizing();
});

$('.nav-link[data-ui-card-target]').on('click', function() {
    doJsSizing();
});

$('.form-expand-button, .form-close-button').on('click', function() {
    doJsSizing();
});
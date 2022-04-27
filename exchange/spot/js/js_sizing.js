function doJsSizing() {
    document.body.style.setProperty('--height-status-bar', $('#status-bar').outerHeight() + 'px');
    document.body.style.setProperty('--height-mobile-nav', $('#mobile-navbar').outerHeight() + 'px');
	document.body.style.setProperty('--height-trading-form', $('#trading-form').outerHeight() + 'px');
	document.body.style.setProperty('--height-mobile-header', $('#mobile-header').outerHeight() + 'px');
	document.body.style.setProperty('--height-main-nav', $('#main-navbar').outerHeight() + 'px');
    document.body.style.setProperty('--height-desktop-header', $('#desktop-header').outerHeight() + 'px');
    
    var obRemainH = $('#orderbook').height() - $('#orderbook-header').outerHeight() - $('#orderbook-middle').outerHeight();
    var obSideRemainH = obRemainH / 2;
    var obItemH = $('.orderbook-item').first().outerHeight();
    var obTargetSideH = Math.round(obSideRemainH / obItemH) * obItemH;
    var obTargetSideHSm = Math.round(obRemainH / obItemH) * obItemH;
    document.body.style.setProperty('--target-height-orderbook-side', obTargetSideH + 'px');
    document.body.style.setProperty('--target-height-orderbook-side-sm', obTargetSideHSm + 'px');
    
    ['markets', 'trades'].forEach(function(i) {
        var remainH = $('#' + i).height() - $('#' + i + '-header').outerHeight();
        var itemH = $('.' + i + '-item').first().outerHeight();
        var targetH = Math.round(remainH / itemH) * itemH;
        document.body.style.setProperty('--target-height-' + i + '-data', targetH + 'px');
    });
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
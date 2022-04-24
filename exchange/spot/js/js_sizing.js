function doJsSizing() {
    document.body.style.setProperty('--height-status-bar', $('#status-bar').outerHeight() + 'px');
    document.body.style.setProperty('--height-mobile-nav', $('#mobile-navbar').outerHeight() + 'px');
    document.body.style.setProperty('--height-trading-form', $('#trading-form').outerHeight() + 'px');
    document.body.style.setProperty('--height-mobile-header', $('#mobile-header').outerHeight() + 'px');
}

$(document).ready(function() {
    doJsSizing();
});
function doJsSizing() {
    document.body.style.setProperty('--height-status-bar', $('#status-bar').outerHeight() + 'px');
    document.body.style.setProperty('--height-mobile-nav', $('#mobile-navbar').outerHeight() + 'px');
    
    var tf = $('#trading-form');
    if(tf.hasClass('d-none'))
	    document.body.style.setProperty('--height-trading-form', tf.outerHeight() + 'px');
	else
		document.body.style.setProperty('--height-trading-form', '0px');
	
	var mh = $('#mobile-header');
	if(mh.hasClass('d-none'))
	    document.body.style.setProperty('--height-mobile-header', mh.outerHeight() + 'px');
	else
		document.body.style.setProperty('--height-mobile-header', '0px');
	
	var mn = $('#main-navbar');
	if(mn.hasClass('d-none'))
	    document.body.style.setProperty('--height-main-nav', mn.outerHeight() + 'px');
	else
		document.body.style.setProperty('--height-main-nav', '0px');
}

$(document).ready(function() {
    doJsSizing();
});
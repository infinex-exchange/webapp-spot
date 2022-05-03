$(document).on('orderAccepted', function(e, data) {
    $.toast({
        heading: 'Order accepted',
        text: `Your ${data.side} ${data.pair} order has been accepted`,
        showHideTransition: 'fade',
        icon: 'info',
        position: 'top-right'
    });
});

$(document).on('orderRejected', function(e, data) {
    switch(data.reason) {
        case 'INSUF_FUNDS':
            $.toast({
                heading: 'Order rejected',
                text: `Insufficient funds for ${data.side} ${data.pair} order`,
                showHideTransition: 'fade',
                icon: 'error',
                position: 'top-right'
            });
            break;
        default:
            break;
    }
});

$(document).on('orderUpdate', function(e, data) {
    if(typeof(data.status) !== 'undefined') switch(data.status) {
        case 'CANCELED':
            $.toast({
                heading: 'Order canceled',
                text: `Your ${data.side} ${data.pair} order has been canceled`,
                showHideTransition: 'fade',
                icon: 'success',
                position: 'top-right'
            });
            break;
        
        case 'FILLED':
            $.toast({
                heading: 'Order filled',
                text: `Your ${data.side} ${data.pair} order has been filled in total`,
                showHideTransition: 'fade',
                icon: 'success',
                position: 'top-right'
            });
            break;
        
        case 'KILLED':
            $.toast({
                heading: 'Order killed',
                text: `Insufficient liquidity to fill ${data.side} ${data.pair} order`,
                showHideTransition: 'fade',
                icon: 'warning',
                position: 'top-right'
            });
            break;
        
        default:
            break;
    }
    
    else if(typeof(data.triggered) !== 'undefined' && data.triggered)
        $.toast({
            heading: 'Stop order triggered',
            text: `Your ${data.side} ${data.pair} order was triggered`,
            showHideTransition: 'fade',
            icon: 'warning',
            position: 'top-right'
        });
});

$(document).on('orderCancelFailed', function(e, data) {
    $.toast({
        heading: 'Cancel order failed',
        text: `Your order cannot be canceled`,
        showHideTransition: 'fade',
        icon: 'error',
        position: 'top-right'
    });
});
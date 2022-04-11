$(document).on('wsAuth', function() {   
    window.wsClient.sub(
        'myOrders',
        function(data) {
            $(document).trigger(data.event, [data]);
            notification(data.event, data);
        },
        function(error) {
            msgBoxRedirect(error);
        }
    );
});

function notification(event, data) {
    switch(event) {
        case 'orderNew':
            $.toast({
                heading: 'Order accepted',
                text: `Your ${data.side} ${data.pairid} order has been accepted`,
                showHideTransition: 'fade',
                icon: 'info',
                position: 'bottom-right'
            });
            break;
        case 'orderFilled':
            $.toast({
                heading: 'Order filled',
                text: `Your ${data.side} ${data.pairid} order has been filled in total`,
                showHideTransition: 'fade',
                icon: 'success',
                position: 'bottom-right'
            });
            break;
        case 'orderInsufLiq':
            $.toast({
                heading: 'Order rejected',
                text: `Insufficient liquidity to fill MARKET ${data.side} ${data.pairid} order`,
                showHideTransition: 'fade',
                icon: 'error',
                position: 'bottom-right'
            });
            break;
        case 'orderCancelFailed':
            $.toast({
                heading: 'Cancel order failed',
                text: `Your order cannot be canceled`,
                showHideTransition: 'fade',
                icon: 'error',
                position: 'bottom-right'
            });
            break;
        case 'orderCanceled':
            $.toast({
                heading: 'Order canceled',
                text: `Your ${data.side} ${data.pairid} order has been canceled`,
                showHideTransition: 'fade',
                icon: 'success',
                position: 'bottom-right'
            });
            break;
        case 'orderInsufFunds':
            $.toast({
                heading: 'Order rejected',
                text: `Insufficient funds for ${data.side} ${data.pairid} order`,
                showHideTransition: 'fade',
                icon: 'error',
                position: 'bottom-right'
            });
            break;
        default:
            break;
    }
}
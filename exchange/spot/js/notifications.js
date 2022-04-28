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
                position: 'top-right'
            });
            break;
        case 'orderFilled':
            $.toast({
                heading: 'Order filled',
                text: `Your ${data.side} ${data.pairid} order has been filled in total`,
                showHideTransition: 'fade',
                icon: 'success',
                position: 'top-right'
            });
            break;
        case 'orderKilled':
            $.toast({
                heading: 'Order killed',
                text: `Insufficient liquidity to fill ${data.side} ${data.pairid} order`,
                showHideTransition: 'fade',
                icon: 'warning',
                position: 'top-right'
            });
            break;
        case 'orderCancelFailed':
            $.toast({
                heading: 'Cancel order failed',
                text: `Your order cannot be canceled`,
                showHideTransition: 'fade',
                icon: 'error',
                position: 'top-right'
            });
            break;
        case 'orderCanceled':
            $.toast({
                heading: 'Order canceled',
                text: `Your ${data.side} ${data.pairid} order has been canceled`,
                showHideTransition: 'fade',
                icon: 'success',
                position: 'top-right'
            });
            break;
        case 'orderInsufFunds':
            $.toast({
                heading: 'Order rejected',
                text: `Insufficient funds for ${data.side} ${data.pairid} order`,
                showHideTransition: 'fade',
                icon: 'error',
                position: 'top-right'
            });
            break;
        case 'orderStopTriggered':
            $.toast({
                heading: 'Stop order triggered',
                text: `Your ${data.side} ${data.pairid} order was triggered`,
                showHideTransition: 'fade',
                icon: 'warning',
                position: 'top-right'
            });
            break;
        default:
            break;
    }
}
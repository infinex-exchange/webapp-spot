$(document).on('wsAuth', function() {   
    window.wsClient.sub(
        'myOrders',
        function(data) {
            
            switch(data.event) {
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
                case 'orderNoLiq':
                    $.toast({
                        heading: 'Order killed',
                        text: `Your market ${data.side} ${data.pairid} order has been killed because of
                               no sufficient liquidity to fill`,
                        showHideTransition: 'fade',
                        icon: 'warning',
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
                default:
                    break;
            }
            
        },
        function(error) {
            msgBoxRedirect(error);
        }
    );
});
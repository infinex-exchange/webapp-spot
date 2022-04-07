$(document).ready(function() {
    // Set rendering stages target
    
    window.renderingStagesTarget = 8; //10
    
    // Connect to pusher
    
    window.wsClient = new StreamsClient(
        config.pusherUrl,
        function() {
            if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                $(document).trigger('renderingStage'); // 10
                $(document).trigger('wsConnected');
            }
            $('.streaming-bad').hide();
            $('.streaming-good').show();
        },
        function() {
            if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                msgBoxNoConn(true);
            }
            $('.streaming-good').hide();
            $('.streaming-bad').show();
        }
    );
    
    window.wsClient.open();   
});

$(document).onFirst('wsConnected', function() {
    window.multiEvents['wsConnected'] = true;
});
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
            else {
                // hide no connection notification
            }
        },
        function() {
            if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                msgBoxNoConn(true);
            }
            else {
                // indicate no connection
            }
        }
    );
    
    window.wsClient.open();   
});

$(document).onFirst('wsConnected', function() {
    window.multiEvents['wsConnected'] = true;
});
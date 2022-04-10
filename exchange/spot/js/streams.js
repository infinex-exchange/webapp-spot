$(document).on('authChecked', function() {  
    window.wsClient = new StreamsClient(
        config.pusherUrl,
        function() {
            $('.streaming-bad').hide();
            $('.streaming-good').show();
            
            if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                $(document).trigger('wsConnected');
                
                if(window.loggedIn)
                    window.wsClient.auth(
                        window.apiKey,
                        function(authorized) {
                            if(!authorized) {
                                msgBoxRedirect('Unauthorized to notifications stream');
                                return;
                            }
                        
                            if(typeof(window.multiEvents['wsAuth']) == 'undefined') {
                                $(document).trigger('wsAuth');
                            }
                        },
                        function(error) {
                            msgBoxRedirect(error);
                        }
                    );
            }
        },
        function() {
            $('.streaming-good').hide();
            $('.streaming-bad').show();
            
            if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                $(document).trigger('wsConnected');
            }
        }
    );
    
    window.wsClient.open();   
});

$(document).onFirst('wsConnected', function() {
    window.multiEvents['wsConnected'] = true;
});

$(document).onFirst('wsAuth', function() {
    window.multiEvents['wsAuth'] = true;
    console.log('first time authorized, can subscriube p[rivate event');
});
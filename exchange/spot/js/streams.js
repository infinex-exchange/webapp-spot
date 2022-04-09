$(document).on('authChecked', function() {  
    window.wsClient = new StreamsClient(
        config.pusherUrl,
        function() {
            $('.streaming-bad').hide();
            $('.streaming-good').show();
            
            if(window.loggedIn)
                window.wsClient.auth(
                    window.apiKey,
                    function(authorized) {
                        if(!authorized) {
                            msgBoxRedirect('Unauthorized to notifications stream');
                            return;
                        }
                        
                        if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                            $(document).trigger('wsConnected');
                        }
                    },
                    function(error) {
                        msgBoxRedirect(error);
                    }
                );
            
            else if(typeof(window.multiEvents['wsConnected']) == 'undefined') {
                $(document).trigger('wsConnected');
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
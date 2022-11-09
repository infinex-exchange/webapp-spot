class StreamsClient {
    constructor(url, onOpen = null, onClose = null) {
        this.url = url;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.subDb = new Array();
        this.reconDelay = 0;
        this.onCloseCalled = false;
        this.restoreSubsAfterAuth = false;
    }
    
    open() {
        var t = this;
        
        t.connTimeout = setTimeout(function() {
	        t.ws.close();
	    }, 5000);
        
        t.ws = new WebSocket(t.url);
               
        t.ws.onopen = function(e) {
	        clearTimeout(t.connTimeout);
	        t.reconDelay = 0;
	        
            t.pingInterval = setInterval(function() {
                t.ping();
            }, 5000);
            
            if(typeof(t.apiKey) !== 'undefined') {
	            t.restoreSubsAfterAuth = true;
                t.auth(t.apiKey, t.authRespCb, t.authErrorCb);
            }
            else
	            t.restoreSubs();
            
            if(t.onOpen != null)
                t.onOpen();
            
            t.onCloseCalled = false;
        }
        
        t.ws.onclose = function(e) {
	        t.ws = null;
	        
            clearTimeout(t.connTimeout);
            if(t.reconDelay < 20000)
	            t.reconDelay += 1000;
	        
	        clearTimeout(t.pingTimeout);
	        clearInterval(t.pingInterval);
            
            setTimeout(function() {
	            t.open();
            }, t.reconDelay);
            
            if(t.onClose != null && !t.onCloseCalled) {
	            t.onCloseCalled = true;
                t.onClose();
            }
        }
        
        t.ws.onmessage = function(e) {
            var msg = JSON.parse(e.data);
            t.process(msg);
        }
    }
    
    ping() {
        var t = this;
        
        t.pingTimeout = setTimeout(function() {
            if(t.onClose != null && !t.onCloseCalled) {
	            t.onCloseCalled = true;
                t.onClose();
            }
            t.ws.close();
        }, 2000);
        
        t.pingId = t.randomId();
        
        t.send({
            op: 'ping',
            id: t.pingId
        });
    }
    
    auth(apiKey, respCallback, errorCallback) { 
        this.authId = this.randomId();
        this.authRespCb = respCallback;
        this.authErrorCb = errorCallback;
        this.apiKey = apiKey;
        
        this.send({
            op: 'auth',
            id: this.authId,
            api_key: this.apiKey
        });
    }
    
    send(obj) {
        if(this.ws && this.ws.readyState === this.ws.OPEN)
            this.ws.send(JSON.stringify(obj));
    }
    
    randomId() {
        return Math.floor(Math.random() * 10000) + 1;
    }
    
    process(msg) {
        var t = this;
        
        if(msg.class == 'resp') {
            if(msg.id == t.pingId) {
                clearTimeout(t.pingTimeout);
                delete t.pingId;
                return;
            }
            
            if(msg.id == t.authId) {
                if(msg.success) {
                    if(t.restoreSubsAfterAuth)
                        t.restoreSubs();
                    t.authRespCb();
                }
                else {
                    t.authErrorCb(msg.error);
	                delete t.apiKey;
	                delete t.authRespCb;
	                delete t.authErrorCb;
	            }
	            
	            delete t.authId;
            }
                
            var errorCalled = false;
               
            for(var stream in t.subDb) {
                if(t.subDb[stream]['id'] == msg.id) {
                    if(t.subDb[stream]['status'] == 'sub_wait') {
                        if(msg.success) {
                            t.subDb[stream]['status'] = 'sub';
                            delete t.subDb[stream]['id'];
                        }
                        else {
                            if(!errorCalled) {
                                t.subDb[stream]['errorCallback'](msg.error);
                                errorCalled = true;
                            }
                            delete t.subDb[stream];
                        }
                    }
                    
                    else if(t.subDb[stream]['status'] == 'unsub_wait') {
                        delete t.subDb[stream];
                        if(!msg.success && !errorCalled) {
                            t.subDb[stream]['errorCallback'](msg.error);
                            errorCalled = true;
                        }
                    }
                }
            }
        }
            
        else if(msg.class == 'data') {
            for(var stream in t.subDb) {
                if(msg.stream == stream)
                    t.subDb[stream]['dataCallback'](msg);
            }
        }
    }
    
    restoreSubs() {
	    var t = this;
        
        var id = t.randomId();
        var streams = new Array();
        var i = 0;
                
        for(var stream in t.subDb) {
            if(t.subDb[stream]['status'] == 'sub' || t.subDb[stream]['status'] == 'sub_wait') {
                t.subDb[stream]['status'] = 'sub_wait';
                t.subDb[stream]['id'] = id;
                streams.push(stream);
	            i++;
            }
            else {
                delete t.subDb[stream];
            }
        }
        
        if(i > 0) {
            this.send({
                op: 'sub',
                streams: streams,
                id: id
            });
        }
    }
    
    sub(streams, dataCallback, errorCallback) {
        var t = this;
        
        var streamsArr = streams;
        if(typeof(streams) === 'string')
            streamsArr = new Array(streams);
            
        var id = t.randomId();
            
        $.each(streamsArr, function(k, stream) {
            var dbEntry = new Array();
            dbEntry['status'] = 'sub_wait';
            dbEntry['dataCallback'] = dataCallback;
            dbEntry['errorCallback'] = errorCallback;
            dbEntry['id'] = id;
            t.subDb[stream] = dbEntry;
        });
        
        t.send({
            op: 'sub',
            streams: streams,
            id: id
        });                 
    }
    
    unsub(streams, errorCallback) {
        var t = this;
        
        var streamsArr = streams;
        if(typeof(streams) === 'string')
            streamsArr = new Array(streams);
            
        var id = t.randomId();
        
        $.each(streamsArr, function(k, stream) {
            if(typeof(t.subDb[stream]) == 'undefined') {
                streamsArr.splice(k, 1);
                return;
            }
            
            t.subDb[stream]['status'] = 'unsub_wait';
            t.subDb[stream]['id'] = id;
        });
        
        if(streamsArr.length == 0)
            return;
        
        t.send({
            op: 'unsub',
            streams: streams,
            id: id
        });
    }
}
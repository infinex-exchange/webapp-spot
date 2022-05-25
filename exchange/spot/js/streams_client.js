class StreamsClient {
    constructor(url, onOpen = null, onClose = null) {
        this.url = url;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.subDb = new Array();
        this.good = false;
    }
    
    open() {
        var t = this;
        
        t.ws = new WebSocket(t.url);
               
        t.ws.onopen = function(e) {
            t.good = true;
            
            t.pingInterval = setInterval(function() {
                t.ping();
            }, 5000);
            
            if(typeof(t.apiKey) !== 'undefined')
                t.auth(t.apiKey, t.authRespCb, t.authErrorCb);
            
            var streams = new Array();
            var i = 0;
            for(var stream in t.subDb) {
                streams.push(stream);
                i++;
            }
            
            if(i > 0) {
                t.send({
                    op: 'sub',
                    streams: streams,
                    id: t.subDb[streams[0]]['id']
                });
            }
            
            if(t.onOpen != null)
                t.onOpen();
        }
        
        t.ws.onclose = function(e) {
            t.closed();
        }
        
        t.ws.onmessage = function(e) {
            var msg = JSON.parse(e.data);
            t.process(msg);
        }
    }
    
    closed() {
        var t = this;
        
        this.good = false;
            
        clearTimeout(this.pingTimeout);
        clearInterval(this.pingInterval);
            
        if(this.onClose != null)
            this.onClose();
        
        setTimeout(function() {
            t.reconnect();
        }, 1000);
    }
    
    reconnect() {
        var t = this;
        
        var id = t.randomId();
                
        for(var stream in t.subDb) {
            if(t.subDb[stream]['status'] == 'sub' || t.subDb[stream]['status'] == 'sub_wait') {
                t.subDb[stream]['status'] = 'sub_wait';
                t.subDb[stream]['id'] = id;
            }
            else {
                delete t.subDb[stream];
            }
        }
        
        t.open();
    }
    
    ping() {
        var t = this;
        
        clearTimeout(t.pingTimeout);
        t.pingTimeout = setTimeout(function() {
            if(t.ws.readyState === t.ws.OPEN)
                t.ws.close();
            else
                t.closed();
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
        if(this.ws.readyState === this.ws.OPEN)
            this.ws.send(JSON.stringify(obj));
        else
            this.closed();
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
                if(msg.success)
                    t.authRespCb(msg.authorized);
                else
                    t.authErrorCb(msg.error);
                
                delete t.apiKey;
                delete t.authRespCb;
                delete t.authErrorCb;
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
        
        if(t.good) t.send({
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
            t.subDb[stream]['status'] = 'unsub_wait';
            t.subDb[stream]['id'] = id;
        });
        
        if(t.good) t.send({
            op: 'unsub',
            streams: streams,
            id: id
        });
    }
}
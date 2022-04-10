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
            t.pingInterval = setInterval(function() {
                t.ping();
            }, 5000);
            
            if(t.onOpen != null)
                t.onOpen();
            
            t.good = true;
            
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
        }
        
        t.ws.onclose = function(e) {
            t.good = false;
            
            clearTimeout(t.pingTimeout);
            clearInterval(t.pingInterval);
            
            if(t.onClose != null)
                t.onClose();
            
            setTimeout(function() {
                t.reconnect();
            }, 1000);
        }
        
        t.ws.onmessage = function(e) {
            var msg = JSON.parse(e.data);
            t.process(msg);
        }
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
            t.ws.close();
        }, 1000);
        
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
        
        this.send({
            op: 'auth',
            id: this.authId,
            api_key: apiKey
        });
    }
    
    send(obj) {
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
                if(msg.success)
                    t.authRespCb(msg.authorized);
                else
                    t.authErrorCb(msg.error);
                    
                delete t.authId;
                delete t.authRespCb;
                delete t.authErrorCb;
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
const tvConfigurationData = {
    supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', 'D', '3D', '1W', '1M']
};

class TvDatafeed {
    static onReady(callback) {
        setTimeout(() => callback(tvConfigurationData));
    };
  
    static searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    };
  
    static resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        const symbolInfo = {
            ticker: window.currentPair,
            name: window.currentPair,
            description: '',
            type: 'crypto',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: '',
            minmov: 1,
            pricescale: Math.pow(10, window.currentQuotePrecision),
            has_intraday: true,
            intraday_multipliers: ['1', '60'],
            has_daily: true,
            has_weekly_and_monthly: false,
            supported_resolutions: tvConfigurationData.supported_resolutions,
            volume_precision: window.currentBasePrecision,
            data_status: 'streaming'
        };

        setTimeout(() => onSymbolResolvedCallback(symbolInfo));
    };
  
    static getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {  
        if(resolution == 'D')
            resolution = '1D';
        
        var tmpFrom = from;
        var buffer = new Array();
        
        function ajaxGetBars() {
            $.ajax({
                url: config.apiUrl + '/spot/candlestick',
                type: 'POST',
                data: JSON.stringify({
                    pair: symbolInfo.base_name[0],
                    res: resolution,
                    from: tmpFrom,
                    to: to
                }),
                contentType: "application/json",
                dataType: "json",
            })
            .done(function (data) {
                if(data.success) {
                    for(var i = 0; i < data.candlestick.length; i++)
                        buffer.push({
                            time: parseInt(data.candlestick[i].time * 1000),
                            open: parseFloat(data.candlestick[i].open),
                            high: parseFloat(data.candlestick[i].high),
                            low: parseFloat(data.candlestick[i].low),
                            close: parseFloat(data.candlestick[i].close),
                            volume: parseFloat(data.candlestick[i].volume)
                        });
                        
                    if(i == 500) {
                        tmpFrom = parseInt(data.candlestick[499].time);
                        ajaxGetBars();
                    }
                    else
                        onHistoryCallback(buffer, { noData: (buffer.length == 0) });
                } else {
                    onErrorCallback(data.error);
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                onErrorCallback(textStatus);  
            });
        }
        
        ajaxGetBars();
    };
  
    static subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
        if(resolution == 'D')
            resolution = '1D';
        window.tradingViewSubscription = window.currentPair + '@candleStick/' + resolution;
        
        window.wsClient.sub(
            window.currentPair + '@candleStick/' + resolution,
            function(data) {
                onRealtimeCallback({
                    time: data.time *= 1000,
                    open: parseFloat(data.open),
                    high: parseFloat(data.high),
                    low: parseFloat(data.low),
                    close: parseFloat(data.close),
                    volume: parseFloat(data.volume)
                });
            },
            function(error) {
                msgBoxRedirect(error);
            }
        );
    };
  
    static unsubscribeBars(subscriberUID) {
        window.wsClient.unsub(
            window.tradingViewSubscription,
            function(error) {
                msgBoxRedirect(error);
            }
        );
    };
};
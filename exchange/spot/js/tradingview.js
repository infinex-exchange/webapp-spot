$(document).on('themeInitialized pairSelected', function() {
    if(typeof(window.multiEvents['themeInitialized']) == 'undefined' || typeof(window.multiEvents['pairSelected']) == 'undefined') return;
    
    window.tvWidget = new TradingView.widget({
        debug: false,
        symbol: window.currentPair,
        datafeed: TvDatafeed,
        interval: '1',
        container_id: 'chart-candles',
        library_path: '/charting_library/',
        locale: 'en',
        disabled_features: [],
        enabled_features: [],
        fullscreen: false,
        autosize: true,
        theme: localStorage.getItem('colorMode')
    });
    
    window.tvWidget.onChartReady(function() {
        $(document).trigger('tradingViewReady');
        $(document).trigger('renderingStage'); // 8
    });
    
});

$(document).onFirst('tradingViewReady', function() {
    window.multiEvents['tradingViewReady'] = true;
});

$(document).on('themeChanged', function(event, theme) {
    if(window.multiEvents['tradingViewReady']) {
        window.tvWidget.changeTheme(theme);
    }
});
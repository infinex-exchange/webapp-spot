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
        disabled_features: [
            'header_symbol_search',
            'symbol_search_hot_key',
            'header_compare',
            'header_screenshot',
            'compare_symbol',
            'header_saveload',
            'symbol_info',
            'volume_force_overlay'
        ],
        enabled_features: [],
        fullscreen: false,
        autosize: true,
        theme: localStorage.getItem('colorMode'),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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
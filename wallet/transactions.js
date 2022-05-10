$(document).ready(function() {
    window.renderingStagesTarget = 1;
});

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        var txHistoryData = {
            api_key: window.apiKey
        };
        initTxHistory($('#recent-tx-data'), $('#recent-tx-preloader'), txHistoryData, false);
    }
});
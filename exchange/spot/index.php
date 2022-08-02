<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../../templates/head.php'); ?>
        <?php include('../../templates/tradingview.html'); ?>
        <?php include('../../imports/bignumber.html'); ?>
        <?php include('../../imports/toast.html'); ?>
        <?php include('../../imports/touchswipe.html'); ?>
        <link rel="stylesheet" href="/spot/css/styles.css?<?php echo filemtime(__DIR__.'/css/styles.css'); ?>">
        <script type="text/javascript" src="/spot/js/streams_client.js?<?php echo filemtime(__DIR__.'/js/streams_client.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/tv_datafeed.js?<?php echo filemtime(__DIR__.'/js/tv_datafeed.js'); ?>"></script>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../../js/ajax_scroll.js'); ?>"></script>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <div class="d-lg-block" id="main-navbar" data-ui-card="markets">
            <?php include('../../templates/navbar.php'); ?>
        </div>
        
        <!-- Mobile navbar -->
        <nav id="mobile-navbar" class="navbar fixed-bottom navbar-expand navbar-mobile d-flex d-lg-none py-0 small">
            <ul class="navbar-nav mx-auto text-center" data-ui-card="markets">
                <?php include('../../templates/mobile_menu_inner.php'); ?>
            </ul>
            <ul class="navbar-nav mx-auto text-center" data-ui-card="trades chart orderbook orders">
                <li class="nav-item">
                    <a class="nav-link" href="#_" data-ui-card-target="markets">
                        <i class="fa-solid fa-chart-simple"></i><br>
                        Markets
                    </a>
                </li>
            </ul>
            <ul class="navbar-nav mx-auto text-center" data-ui-card="trades chart orderbook orders">
                <li class="nav-item">
                    <a class="nav-link" href="#_" data-ui-card-target="trades">
                        <i class="fa-solid fa-right-left"></i></i><br>
                        Trades
                    </a>
                </li>
                <li class="nav-item"">
                    <a class="nav-link active" href="#_" data-ui-card-target="chart">
                        <i class="fa-solid fa-chart-line"></i><br>
                        Chart
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#_" data-ui-card-target="orderbook">
                        <i class="fa-solid fa-arrow-up-short-wide"></i><br>
                        Orderbook
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#_" data-ui-card-target="orders">
                        <i class="fa-solid fa-user-clock"></i><br>
                        My orders
                    </a>
                </li>
            </ul>
        </nav>
        
        <!-- Status bar -->
        <nav id="status-bar" class="navbar fixed-bottom navbar-expand status-bar d-none d-lg-flex py-1 px-2 small">
            <ul class="navbar-nav">
                <li class="streaming-good text-success nav-item">
                    <i class="fas fa-sync fa-spin"></i>
                    Streaming data
                </li>
                <li class="streaming-bad text-danger nav-item">
                    <i class="fa-solid fa-bolt fa-beat"></i>
                    Connection lost
                </li>
            </ul>
        </nav>
        
        <!-- Root container -->
        <div class="container-fluid container-1500 p-0">
        <div class="row m-0">
        
        <!-- Mobile header -->
        <div id="mobile-header" class="col-12 d-lg-none p-0 ui-column order-1 order-lg-1 secondary">
        <div class="row m-0 flex-nowrap">
            <div class="col-1 ui-card my-auto" data-ui-card="trades chart orderbook orders">
                <a class="nav-link p-0" href="#_" data-ui-card-target="markets">
                    <i class="fa-solid fa-arrow-left fa-lg"></i>
                </a>
            </div>
            
            <div class="col-3 ui-card ui-card-hor my-auto small" data-ui-card="trades chart orderbook orders">
                <h4 class="primary ticker-name"></h4>
                <span class="ticker-base-name"></span>
            </div>
                
            <div class="col-8 ui-card ui-card-hor" data-ui-card="trades chart orderbook orders">
                <div class="row flex-nowrap overflow-hidden small">
                    <div class="col-auto">
                        Price
                        <span class="primary ticker-price d-block"></span>
                    </div>
                    <div class="col-auto">
                         24h change
                         <span class="primary ticker-change d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h high
                        <span class="primary ticker-high d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h low
                        <span class="primary ticker-low d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h vol (<span class="ticker-base-legend"></span>)
                        <span class="primary ticker-vol-base d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h vol (<span class="ticker-quote-legend"></span>)
                        <span class="primary ticker-vol-quote d-block"></span>
                    </div>
                </div>
            </div>
        <!-- / Mobile header -->
        </div>
        </div>
        
        <!-- Left column -->
        <div class="col-12 col-lg-3 p-0 ui-column order-2 order-lg-2">
        <div class="row m-0">
        
            <!-- Markets
                  markets-search - input
                  markets-table - div
            -->
            <div id="markets" class="col-12 ui-card ui-card-ver d-lg-block half-column-height sm-rest-of-height" data-ui-card="markets">
                <div id="markets-header">
                <form>
                    <div class="form-row">
                        <input id="markets-search" type="text" placeholder="Search" class="form-control form-control-sm input-search">
                    </div>
                </form>
                <div id="markets-quotes" class="nav small">
                </div>
                <div class="row flex-nowrap scrollable p-1 py-lg-0 secondary">
                    <div class="col-1">
                    </div>
                    <div class="col-4">
                        <h6>Pair</h6>
                    </div>
                    <div class="col-4 text-end">
                        <h6>Price</h6>
                    </div>
                    <div class="col-3 text-end">
                        <h6>Change</h6>
                    </div>
                </div>
                </div>
                <div id="markets-table" class="scrollable">         
                </div>
            
            <!-- / Markets -->
            </div>
            
            <!-- Market trades -->
            <div id="trades" class="col-12 ui-card ui-card-ver d-lg-block half-column-height sm-rest-of-height" data-ui-card="trades">
                <div id="trades-header" class="row scrollable secondary">
                    <div class="col-4">
                        <h6>Price</h6>
                    </div>
                    <div class="col-4 text-end">
                        <h6>Amount</h6>
                    </div>
                    <div class="col-4 text-end">
                        <h6>Time</h6>
                    </div>
                </div>
                        
                <div id="trades-data" class="scrollable small">
                </div>   
            <!-- / Market trades -->
            </div>
        
        <!-- / Left column -->
        </div>
        </div>
        
        <!-- Center column 
              - chart-candles - div
        -->
        <div class="col-12 col-lg-6 p-0 ui-column order-4 order-lg-3">
        <div class="row m-0">
        
            <!-- Header -->
            <div id="desktop-header" class="col-3 ui-card ui-card-ver ui-card-hor my-auto small d-none d-lg-block secondary">
                <h4 class="primary ticker-name"></h4>
                <span class="ticker-base-name"></span>
            </div>
                
            <div class="col-9 ui-card ui-card-hor d-none d-lg-block secondary">
                <div class="row flex-nowrap overflow-hidden small">
                    <div class="col-auto">
                        Price
                        <span class="primary ticker-price d-block"></span>
                    </div>
                    <div class="col-auto">
                         24h change
                         <span class="primary ticker-change d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h high
                        <span class="primary ticker-high d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h low
                        <span class="primary ticker-low d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h vol (<span class="ticker-base-legend"></span>)
                        <span class="primary ticker-vol-base d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h vol (<span class="ticker-quote-legend"></span>)
                        <span class="primary ticker-vol-quote d-block"></span>
                    </div>
                </div>
            </div>
            
            <!-- TradingView -->
            <div class="col-12 ui-card ui-card-ver d-lg-block" style="padding: 0px !important" data-ui-card="chart">                
                <div class="rest-of-height sm-rest-of-height" id="chart-candles">
                </div>
            </div>
            
            <!-- Trading form -->
            <div class="col-12 d-lg-block ui-card ui-card-ver ui-card-light secondary" id="trading-form" data-ui-card="trades chart orderbook orders">
            <div class="row d-lg-none" id="form-compact-buttons">
                <div class="col-6 ps-2 pe-1">
                    <button type="button" class="btn bg-green w-100 form-expand-button" data-side="BUY">BUY</button>
                </div> 
                <div class="col-6 ps-1 pe-2">
                    <button type="button" class="btn bg-red w-100 form-expand-button" data-side="SELL">SELL</button>
                </div>
            </div>
            <div class="d-none d-lg-block" id="form-inner">
                <div class="nav">
                    <a class="nav-link switch-order-type" href="#_" data-type="LIMIT">Limit</a>
                    <a class="nav-link switch-order-type" href="#_" data-type="MARKET">Market</a>
                    <a class="nav-link switch-order-type" href="#_" data-type="STOP_LIMIT">Stop-Limit</a>
                    
                    <div class="dropdown ms-auto">
                        <a id="current-tif" class="nav-link dropdown-toggle" href="#_" data-bs-toggle="dropdown"></a>
                    
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item switch-time-in-force" href="#_" data-tif="GTC">Good Till Canceled</a>
                            </li>
                            <li>
                                <a class="dropdown-item switch-time-in-force" href="#_" data-tif="IOC">Immediate Or Cancel</a>
                            </li>
                            <li>
                                <a class="dropdown-item switch-time-in-force" href="#_" data-tif="FOK">Fill Or Kill</a>
                            </li>
                        </ul>
                    </div>
                    
                    <a class="nav-link ms-auto d-lg-none form-close-button" href="#_">
                        <i class="fa-solid fa-xmark"></i>
                    </a>
                </div>   
                <div class="row">
                    <div class="col-12 col-lg-6 d-lg-block form-inner-side" data-side="BUY">
                        <form class="row m-0">
                            <div class="col-12 p-0 pb-2 user-only small">
                                <span>Available:</span>
                                <span class="float-end primary" id="form-quote-balance"></span>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Stop</span>
                                    <input id="form-buy-stop" type="text" class="form-control form-stop" data-side="BUY" data-tsval="" data-rval="">
                                    <span class="suffix form-quote-suffix"></span>
                                </div>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Price</span>
                                    <input id="form-buy-price" type="text" class="form-control form-price" data-side="BUY" data-tsval="" data-rval="">
                                    <span class="suffix form-quote-suffix"></span>
                                </div>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Amount</span>
                                    <input id="form-buy-amount" type="text" class="form-control form-amount" data-side="BUY" data-tsval="" data-rval="">
                                    <span class="suffix form-base-suffix"></span>
                                </div>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Total</span>
                                    <input id="form-buy-total" type="text" class="form-control form-total" data-side="BUY" data-tsval="" data-rval="">
                                    <span class="suffix form-quote-suffix"></span>
                                </div>
                            </div>
                            <div class="col-6 col-lg-12 p-0 pe-1 pe-lg-0 noSwipe">
                                <span class="range-value" for="form-buy-range" suffix="%"></span>
                                <input id="form-buy-range" type="range" class="form-range" data-side="BUY" min="0" max="100" step="5" value="0">
                            </div>
                            <div class="col-6 col-lg-12 p-0 p-0 ps-1 ps-lg-0">
                                <button type="button" id="form-buy-submit" class="btn bg-green w-100 user-only form-submit" data-side="BUY">BUY</button>
                                <div class="guest-only small border border-green rounded p-2 text-center">
                                    <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                                </div>
                            </div> 
                        </form>
                    </div>
                    <div class="col-12 col-lg-6 d-lg-block form-inner-side" data-side="SELL">
                        <form class="row m-0">
                            <div class="col-12 p-0 pb-2 user-only small">
                                <span>Available:</span>
                                <span class="float-end primary" id="form-base-balance"></span>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Stop</span>
                                    <input id="form-sell-stop" type="text" class="form-control form-stop" data-side="SELL" data-tsval="" data-rval="">
                                    <span class="suffix form-quote-suffix"></span>
                                </div>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Price</span>
                                    <input id="form-sell-price" type="text" class="form-control form-price" data-side="SELL" data-tsval="" data-rval="">
                                    <span class="suffix form-quote-suffix"></span>
                                </div>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Amount</span>
                                    <input id="form-sell-amount" type="text" class="form-control form-amount" data-side="SELL" data-tsval="" data-rval="">
                                    <span class="suffix form-base-suffix"></span>
                                </div>
                            </div>
                            <div class="col-12 p-0 pb-2">
                                <div class="input-ps-group">
                                    <span>Total</span>
                                    <input id="form-sell-total" type="text" class="form-control form-total" data-side="SELL" data-tsval="" data-rval="">
                                    <span class="suffix form-quote-suffix"></span>
                                </div>
                            </div>
                            <div class="col-6 col-lg-12 p-0 pe-1 pe-lg-0 noSwipe">
                                <span class="range-value" for="form-sell-range" suffix="%"></span>
                                <input id="form-sell-range" type="range" class="form-range" data-side="SELL" min="0" max="100" step="5" value="0">
                            </div>
                            <div class="col-6 col-lg-12 p-0 ps-1 ps-lg-0">
                                <button type="button" id="form-sell-submit" class="btn bg-red w-100 user-only form-submit" data-side="SELL">SELL</button>
                                <div class="guest-only small border border-red rounded p-2 text-center">
                                    <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                                </div>
                            </div> 
                        </form>
                    </div>
                </div>      
            </div>
            </div>
        
        <!-- / Center column -->
        </div>
        </div>
        
        <!-- Right column
              - orderbook-sell - div
              - orderbook-buy - div
        -->
        <div class="col-12 col-lg-3 p-0 ui-column order-3 order-lg-4">
        <div class="row m-0">
            
            <div id="orderbook" class="col-12 ui-card ui-card-ver d-lg-block column-height sm-rest-of-height" data-ui-card="orderbook">
                <div class="row m-0">
                    <div class="col-6 col-lg-12 p-0 ps-1 ps-lg-0 order-4 order-lg-1">
                        <div id="orderbook-header" class="row secondary">
                            <div class="col-6 col-lg-4">
                                <h6>Price</h6>
                            </div>
                            <div class="col-6 col-lg-4 text-end">
                                <h6>Amount</h6>
                            </div>
                            <div class="col-6 col-lg-4 d-none d-lg-block text-end">
                                <h6>Total</h6>
                            </div>
                        </div>
                
                        <div id="orderbook-sell" class="small"> 
                        </div>
                    </div>
                    
                    <div id="orderbook-middle" class="col-auto d-none d-lg-block order-2 order-lg-2 px-0 py-3">
                        <h3 class="d-inline orderbook-middle-price"></h3>
                        <h3 class="d-inline">
                            <i class="orderbook-middle-arrow fa-solid"></i>
                        </h3>
                    </div>
                    
                    <div id="orderbook-middle" class="col-auto ms-auto d-none d-lg-block order-3 order-lg-3 px-0 py-3">
                        <a href="#_"><img src="/img/ob_split.svg" width="16" height="16"></a>
                        <a class="px-3" href="#_"><img src="/img/ob_bids.svg" width="16" height="16"></a>
                        <a href="#_"><img src="/img/ob_asks.svg" width="16" height="16"></a>
                    </div>
                    
                    <div class="col-6 col-lg-12 p-0 pe-1 pe-lg-0 order-1 order-lg-4">
                        <div class="row d-lg-none secondary">
                            <div class="col-6">
                                <h6>Price</h6>
                            </div>
                            <div class="col-6 text-end">
                                <h6>Amount</h6>
                            </div>
                        </div>
            
                        <div id="orderbook-buy" class="reverse-rows small">
                        </div>
                    </div>
                </div>
            </div>
        
        <!-- / Right column -->
        </div>
        </div>
        
            <!-- Open orders, order history
                  - orders-open-data - div
                  - orders-history-data - div
            -->
            <div id="orders" class="col-12 ui-card ui-column d-lg-block order-5 order-lg-5 sm-rest-of-height" data-ui-card="orders">
            
                <nav id="orders-header">
                <div class="nav nav-tab nav-deco d-flex flex-nowrap" role="tablist">
                    <a class="nav-link orders-tab-switch active" data-bs-toggle="tab" data-bs-target="#orders-open" href="#_" role="tab" aria-controls="orders-open" aria-selected="true">Open orders</a>
                    <a class="nav-link orders-tab-switch" data-bs-toggle="tab" data-bs-target="#orders-history" href="#_" role="tab" aria-controls="orders-history" aria-selected="false">Orders history</a>
                    <a class="nav-link orders-tab-switch" data-bs-toggle="tab" data-bs-target="#trades-history" href="#_" role="tab" aria-controls="trades-history" aria-selected="false">Trades history</a>
                </div>
                </nav>
                
                <div class="tab-content">
                
                    <div class="tab-pane fade show active" id="orders-open" role="tabpanel" aria-labelledby="orders-open-tab">
                    
                        <div class="row user-only scrollable secondary d-none d-lg-flex px-1">
                            <div style="width: 12%">
                                <h6>Date</h6>
                            </div>
                            <div style="width: 10%">
                                <h6>Pair</h6>
                            </div>
                            <div style="width: 10%">
                                <h6>Type</h6>
                            </div>
                            <div style="width: 4%">
                                <h6>Side</h6>
                            </div>
                            <div class="text-end" style="width: 11%">
                                <h6>Price</h6>
                            </div>
                            <div class="text-end" style="width: 11%">
                                <h6>Amount</h6>
                            </div>
                            <div class="text-end pe-0" style="width: 11%">
                                <h6>Filled</h6>
                            </div>
                            <div style="width: 5%">
                            </div>
                            <div class="text-end" style="width: 11%">
                                <h6>Total</h6>
                            </div>
                            <div class="text-end" style="width: 12%">
                                <h6>Triggers</h6>
                            </div>
                            <div style="width: 3%">
                            </div>
                        </div>
                        
                        <div id="orders-open-data" class="scrollable small d-flex">
                            <div class="guest-only m-auto">
                                <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div>  
                        </div>
                        
                    </div>
                    
                    <div class="tab-pane fade" id="orders-history" role="tabpanel" aria-labelledby="orders-history-tab">
                    
                        <div class="row user-only scrollable secondary d-none d-lg-flex px-1">
                            <div style="width: 2%">
                            </div>
                            <div style="width: 11%">
                                <h6>Date</h6>
                            </div>
                            <div style="width: 8%">
                                <h6>Pair</h6>
                            </div>
                            <div style="width: 8%">
                                <h6>Type</h6>
                            </div>
                            <div style="width: 4%">
                                <h6>Side</h6>
                            </div>
                            <div class="text-end" style="width: 9%">
                                <h6>Price</h6>
                            </div>
                            <div class="text-end" style="width: 9%">
                                <h6>Average</h6>
                            </div>
                            <div class="text-end" style="width: 10%">
                                <h6>Amount</h6>
                            </div>
                            <div class="text-end" style="width: 10%">
                                <h6>Filled</h6>
                            </div>
                            <div class="text-end" style="width: 10%">
                                <h6>Total</h6>
                            </div>
                            <div class="text-end" style="width: 11%">
                                <h6>Triggers</h6>
                            </div>
                            <div class="text-end" style="width: 8%">
                                <h6>Status</h6>
                            </div>
                        </div>
                        
                        <div id="orders-history-data" class="scrollable small d-flex">
                            <div class="guest-only m-auto">
                                <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div>    
                        </div>
                    
                    </div>
                    
                    <div class="tab-pane fade" id="trades-history" role="tabpanel" aria-labelledby="trades-history-tab">
                    
                        <div class="row user-only scrollable secondary d-none d-lg-flex px-1">
                            <div style="width: 14%">
                                <h6>Date</h6>
                            </div>
                            <div style="width: 12%">
                                <h6>Pair</h6>
                            </div>
                            <div style="width: 6%">
                                <h6>Side</h6>
                            </div>
                            <div class="text-end" style="width: 14%">
                                <h6>Price</h6>
                            </div>
                            <div class="text-end" style="width: 14%">
                                <h6>Amount</h6>
                            </div>
                            <div class="text-end" style="width: 14%">
                                <h6>Total</h6>
                            </div>
                            <div class="text-end" style="width: 14%">
                                <h6>Fee</h6>
                            </div>
                            <div class="text-end" style="width: 12%">
                                <h6>Role</h6>
                            </div>
                        </div>
                        
                        <div id="trades-history-data" class="scrollable small d-flex">
                            <div class="guest-only m-auto">
                                <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div>    
                        </div>
                    
                    </div>
                    
                </div>
          
            <!-- / Open orders, order history -->
            </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <!-- Don't hide content behind status bar -->
        <div style="height: var(--height-status-bar)" class="d-none d-lg-block"></div>
        
        <?php include('../../templates/modals.php'); ?>
        
        <script type="text/javascript" src="/spot/js/js_sizing.js?<?php echo filemtime(__DIR__.'/js/js_sizing.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/streams.js?<?php echo filemtime(__DIR__.'/js/streams.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/markets.js?<?php echo filemtime(__DIR__.'/js/markets.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/tradingview.js?<?php echo filemtime(__DIR__.'/js/tradingview.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/ticker.js?<?php echo filemtime(__DIR__.'/js/ticker.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/trades.js?<?php echo filemtime(__DIR__.'/js/trades.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/orderbook.js?<?php echo filemtime(__DIR__.'/js/orderbook.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/orders.js?<?php echo filemtime(__DIR__.'/js/orders.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/trading_form.js?<?php echo filemtime(__DIR__.'/js/trading_form.js'); ?>"></script>
        <script type="text/javascript" src="/spot/js/notifications.js?<?php echo filemtime(__DIR__.'/js/notifications.js'); ?>"></script>
    </body>
</html>

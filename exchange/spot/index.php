<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../../templates/head.php'); ?>
        <?php include('../../templates/tradingview.html'); ?>
        <?php include('../../templates/bignumber.html'); ?>
        <link rel="stylesheet" href="/spot/css/styles.css">
        <script type="text/javascript" src="/spot/js/tv_datafeed.js"></script>
        <script src="/js/ajax_scroll.js"></script>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../../templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div class="container-fluid container-1500 pt-2">
        <div class="row m-0">
        
        <!-- Left column -->
        <div class="col-12 col-lg-3 p-0 ui-column">
        <div class="row m-0">
        
            <!-- Markets
                  markets-search - input
                  markets-table - div
            -->
            <div class="col-12 ui-card ui-card-ver">
                <form>
                    <div class="form-row">
                        <input id="markets-search" type="text" size="5" placeholder="Search" class="form-control form-control-sm input-search">
                    </div>
                </form>
                <div id="markets-quotes" class="nav font-1">
                </div>
                <div class="row">
                    <div class="col-1">
                    </div>
                    <div class="col-3">
                        <h5>Pair</h5>
                    </div>
                    <div class="col-4 text-end">
                        <h5>Price</h5>
                    </div>
                    <div class="col-3 text-end">
                        <h5>Change</h5>
                    </div>
                </div>
                <div id="markets-table" class="scrollable font-1">         
                </div>
            
            <!-- / Markets -->
            </div>
            
            <!-- Market trades + my trades
                  trades-market-data - div
                  trades-my-data - div
            -->
            <div class="col-12 ui-card ui-card-ver">
            
                <nav>
                <div class="nav nav-tab nav-deco font-2" role="tablist">
                    <a class="nav-link active" data-bs-toggle="tab" data-bs-target="#trades-market" href="#" role="tab" aria-controls="trades-market" aria-selected="true">Market trades</a>
                    <a class="nav-link" data-bs-toggle="tab" data-bs-target="#trades-my" href="#" role="tab" aria-controls="trades-my" aria-selected="false">My trades</a>
                </div>
                </nav>
                
                <div class="tab-content">
                
                    <div class="tab-pane fade show active" id="trades-market" role="tabpanel" aria-labelledby="trades-market-tab">
                    
                        <div class="row scrollable">
                            <div class="col-4">
                                <h5>Price</h5>
                            </div>
                            <div class="col-4 text-end">
                                <h5>Amount</h5>
                            </div>
                            <div class="col-4 text-end">
                                <h5>Time</h5>
                            </div>
                        </div>
                        
                        <div id="trades-market-data" class="scrollable font-1">
                        </div>
                        
                    </div>
                    
                    <div class="tab-pane fade" id="trades-my" role="tabpanel" aria-labelledby="trades-my-tab">
                    
                        <div class="row user-only scrollable">
                            <div class="col-4">
                                <h5>Price</h5>
                            </div>
                            <div class="col-4 text-end">
                                <h5>Amount</h5>
                            </div>
                            <div class="col-4 text-end">
                                <h5>Time</h5>
                            </div>
                        </div>
                        
                        <div id="trades-my-data" class="scrollable font-1">
                            <div class="guest-only m-auto">
                                <a class="link-ultra" href="#" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div>  
                        </div>
                    
                    </div>
                    
                </div>
          
            <!-- / Market trades + my trades -->
            </div>
        
        <!-- / Left column -->
        </div>
        </div>
        
        <!-- Center column 
              - chart-candles - div
        -->
        <div class="col-12 col-lg-6 p-0 ui-column">
        <div class="row m-0">
        
            <!-- Header -->
            <div class="col-3 ui-card ui-card-ver ui-card-hor my-auto font-1">
                <h1 id="ticker-name"></h1>
                <span id="ticker-base-name"></span>
            </div>
                
            <div class="col-9 ui-card ui-card-hor">
                <div class="row flex-nowrap font-1">
                    <div class="col-auto">
                        Price
                        <span id="ticker-price" class="text-hi d-block"></span>
                    </div>
                    <div class="col-auto">
                         24h change
                         <span id="ticker-change" class="text-hi d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h high
                        <span id="ticker-high" class="text-hi d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h low
                        <span id="ticker-low" class="text-hi d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h vol (<span id="ticker-base-legend"></span>)
                        <span id="ticker-vol-base" class="text-hi d-block"></span>
                    </div>
                    <div class="col-auto">
                        24h vol (<span id="ticker-quote-legend"></span>)
                        <span id="ticker-vol-quote" class="text-hi d-block"></span>
                    </div>
                </div>
            </div>
            
            <!-- TradingView -->
            <div class="col-12 ui-card ui-card-ver" style="padding: 0px !important">                
                <div id="chart-candles">
                </div>
            </div>
            
            <!-- Trading form -->
            <div class="col-12 ui-card ui-card-ver ui-card-high">
                <div class="nav font-2">
                    <a class="nav-link switch-order-type active" href="#_" data-type="LIMIT">Limit</a>
                    <a class="nav-link switch-order-type" href="#_" data-type="MARKET">Market</a>
                </div>   
                <div class="row">
                    <div class="col-6">
                        <form class="font-2 d-grid gap-2">
                            <div class="user-only font-1">
                                <span>Available:</span>
                                <span class="float-end" id="form-quote-balance"></span>
                            </div>
                            <div class="input-ps-group">
                                <span>Price</span>
                                <input id="form-buy-price" type="text" class="form-control">
                                <span class="suffix form-quote-suffix"></span>
                            </div>
                            <div class="input-ps-group">
                                <span>Amount</span>
                                <input id="form-buy-amount" type="text" class="form-control">
                                <span class="suffix form-base-suffix"></span>
                            </div>
                            <div class="input-ps-group">
                                <span>Total</span>
                                <input id="form-buy-total" type="text" class="form-control">
                                <span class="suffix form-quote-suffix"></span>
                            </div>
                            <div>
                                <span class="range-value" for="form-buy-range" suffix="%"></span>
                                <input id="form-buy-range" type="range" class="form-range" min="0" max="100" step="5" value="0">
                            </div>
                            <button type="button" id="form-buy-submit" class="btn btn-success btn-block user-only">BUY</button>
                            <div class="guest-only font-1 border border-success rounded p-2 text-center">
                                <a class="link-ultra" href="#" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div> 
                        </form>
                    </div>
                    <div class="col-6">
                        <form class="font-2 d-grid gap-2">
                            <div class="user-only font-1">
                                <span>Available:</span>
                                <span class="float-end" id="form-base-balance"></span>
                            </div>
                            <div class="input-ps-group">
                                <span>Price</span>
                                <input id="form-sell-price" type="text" class="form-control">
                                <span class="suffix form-quote-suffix"></span>
                            </div>
                            <div class="input-ps-group">
                                <span>Amount</span>
                                <input id="form-sell-amount" type="text" class="form-control">
                                <span class="suffix form-base-suffix"></span>
                            </div>
                            <div class="input-ps-group">
                                <span>Total</span>
                                <input id="form-sell-total" type="text" class="form-control">
                                <span class="suffix form-quote-suffix"></span>
                            </div>
                            <div>
                                <span class="range-value" for="form-sell-range" suffix="%"></span>
                                <input id="form-sell-range" type="range" class="form-range" min="0" max="100" step="5" value="0">
                            </div>
                            <button type="button" id="form-sell-submit" class="btn btn-danger btn-block user-only">SELL</button>
                            <div class="guest-only font-1 border border-danger rounded p-2 text-center">
                                <a class="link-ultra" href="#" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div> 
                        </form>
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
        <div class="col-12 col-lg-3 p-0 ui-column">
        <div class="row m-0">
            
            <div class="col-12 ui-card ui-card-ver">
                <div class="row">
                    <div class="col-4">
                        <h5>Price</h5>
                    </div>
                    <div class="col-4 text-end">
                        <h5>Amount</h5>
                    </div>
                    <div class="col-4 text-end">
                        <h5>Total</h5>
                    </div>
                </div>
                
                <div id="orderbook-sell" class="font-1"> 
                </div>
            
                <div id="orderbook-buy" class="font-1">
                </div>
            </div>
        
        <!-- / Right column -->
        </div>
        </div>
        
            <!-- Open orders, order history
                  - orders-open-data - div
                  - orders-history-data - div
            -->
            <div class="col-12 ui-card ui-column">
            
                <nav>
                <div class="nav nav-tab nav-deco font-2" role="tablist">
                    <a class="nav-link active" data-bs-toggle="tab" data-bs-target="#orders-open" href="#" role="tab" aria-controls="orders-open" aria-selected="true">Open orders</a>
                    <a class="nav-link" data-bs-toggle="tab" data-bs-target="#orders-history" href="#" role="tab" aria-controls="orders-history" aria-selected="false">Order history</a>
                </div>
                </nav>
                
                <div class="tab-content">
                
                    <div class="tab-pane fade show active" id="orders-open" role="tabpanel" aria-labelledby="orders-open-tab">
                    
                        <div class="row user-only">
                            <div class="col">
                                <h5>Date</h5>
                            </div>
                            <div class="col">
                                <h5>Pair</h5>
                            </div>
                            <div class="col">
                                <h5>Type</h5>
                            </div>
                            <div class="col">
                                <h5>Side</h5>
                            </div>
                            <div class="col">
                                <h5>Price</h5>
                            </div>
                            <div class="col">
                                <h5>Amount</h5>
                            </div>
                            <div class="col">
                                <h5>Filled</h5>
                            </div>
                            <div class="col">
                                <h5>Total</h5>
                            </div>
                            <div class="col">
                            </div>
                        </div>
                        
                        <div id="orders-open-data" class="scrollable font-1 d-flex">
                            <div class="guest-only m-auto">
                                <a class="link-ultra" href="#" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div>  
                        </div>
                        
                    </div>
                    
                    <div class="tab-pane fade" id="orders-history" role="tabpanel" aria-labelledby="orders-history-tab">
                    
                        <div class="row user-only">
                            <div class="col-4">
                                <h5>Price</h5>
                            </div>
                            <div class="col-4">
                                <h5>Amount</h5>
                            </div>
                            <div class="col-4">
                                <h5>Time</h5>
                            </div>
                        </div>
                        
                        <div id="orders-history-data" class="scrollable font-1 d-flex">
                            <div class="guest-only m-auto">
                                <a class="link-ultra" href="#" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to trade
                            </div>    
                        </div>
                    
                    </div>
                    
                </div>
          
            <!-- / Open orders, order history -->
            </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <?php include('../../templates/modals.html'); ?>
        
        <script type="text/javascript" src="/js/range_value.js"></script>
        <script type="text/javascript" src="/spot/js/markets.js"></script>
        <script type="text/javascript" src="/spot/js/tradingview.js"></script>
        <script type="text/javascript" src="/spot/js/ticker.js"></script>
        <script type="text/javascript" src="/spot/js/trades.js"></script>
        <script type="text/javascript" src="/spot/js/orderbook.js"></script>
        <script type="text/javascript" src="/spot/js/orders.js"></script>
        <script type="text/javascript" src="/spot/js/trading_form.js"></script>
    </body>
</html>

<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../js/ajax_scroll.js'); ?>"></script>
        <title>Wallet | Vayamos Exchange</title>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest p-0 user-only">
        <div class="row m-0 h-100">
        
        <!-- Main column -->
        <div class="col-12 col-lg-9 p-0 ui-card ui-column">
            
            <form>
            <div class="row p-2">
                <div class="col-auto my-auto">
                    <a href="/wallet/deposit" class="btn btn-primary btn-sm">Deposit</a>
                    <a href="/wallet/withdraw" class="btn btn-primary btn-sm">Withdraw</a>
                </div>
                
                <div class="col-auto my-auto">
                    <input id="asset-search" type="text" size="5" placeholder="Search" class="form-control input-search">
                </div>
                
                <div class="col-auto my-auto">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="asset-hide-zero">
                        <label class="form-check-label" for="asset-hide-zero">
                            Hide zero balances
                        </label>
                    </div>
                </div>
            </div>
            </form>
            
            <div class="row p-2">
                <div class="col-1">
                </div>
                <div class="col-2">
                <h5>Token</h5>
                </div>
                <div class="col-2 text-end">
                <h5>Total</h5>
                </div>
                <div class="col-2 text-end">
                <h5>Available</h5>
                </div>
                <div class="col-2 text-end">
                <h5>Locked</h5>
                </div>
                <div class="col-3">
                <h5>Action</h5>
                </div>
            </div>
            
            <div id="asset-data">
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- Right column -->
        <div class="col-12 col-lg-3 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h3>Recent transactions</h3>
            </div>
            
            <div id="recent-tx-data">
            </div>
        
        <!-- / Right column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/js/recent_tx.js?<?php echo filemtime(__DIR__.'/../js/recent_tx.js'); ?>"></script>
        <script src="/wallet/overview.js?<?php echo filemtime(__DIR__.'/overview.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
    
    </body>
</html>

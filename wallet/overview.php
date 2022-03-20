<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/ajax_scroll.js"></script>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 pt-2 user-only">
        <div class="row m-0">
        
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
            
            <div class="row p-2 text-hi">
                <div class="col-1">
                </div>
                <div class="col-2">
                Token
                </div>
                <div class="col-2 text-end">
                Total
                </div>
                <div class="col-2 text-end">
                Available
                </div>
                <div class="col-2 text-end">
                Locked
                </div>
                <div class="col-3">
                Action
                </div>
            </div>
            
            <div id="asset-data">
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- Right column -->
        <div class="col-12 col-lg-3 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h1>Recent transactions</h1>
            </div>
            
            <div id="recent-tx-data">
            </div>
        
        <!-- / Right column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/js/recent_tx.js"></script>
        <script src="/wallet/overview.js"></script>
        
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/ajax_scroll.js"></script>
        <?php include('../templates/qrcode.html'); ?>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest pt-2 user-only">
        <div class="row m-0 h-100">
        
        <!-- Main column -->
        <div class="col-12 col-lg-9 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h1>Deposit</h1>
            </div>
            
            <div class="row p-2">
                <h3>&#9312 Select coin to deposit:</h3>
                <?php include('../templates/select_coin.html'); ?>
            </div>
            
            <div id="deposit-step2" style="display: none">
                <div class="row p-2">
                    <h3>&#9313 Select deposit network:</h3>
                    <?php include('../templates/select_net.html'); ?>
                </div>
            </div>
            
            <div id="deposit-step3" style="display: none">
                <div class="row p-2">
                    <h3>&#9314 Complete deposit:</h3>
                    Address: <span id="deposit-addr"></span>
                    <div class="qrcode-wrapper">
                        <div id="deposit-qrcode"></div>
                    </div>
                </div>
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- Right column -->
        <div class="col-12 col-lg-3 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h1>Last deposits</h1>
            </div>
            
            <div id="recent-tx-data">
            </div>
        
        <!-- / Right column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/js/recent_tx.js"></script>
        <script src="/wallet/deposit.js"></script>
        
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

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
        <?php include('../templates/navbar.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest pt-2 user-only">
        <div class="row m-0 h-100">
        
        <!-- Main column -->
        <div class="col-12 col-lg-9 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h2>Withdraw</h2>
            </div>
            
            <div class="row p-2">
                <h3>&#9312 Select coin to withdraw:</h3>
                <?php include('../templates/select_coin.html'); ?>
            </div>
            
            <div id="withdraw-step2" style="display: none">
                <div class="row p-2">
                    <h3>&#9313 Select withdrawal network:</h3>
                    <?php include('../templates/select_net.html'); ?>
                </div>
            </div>
            
            <div id="withdraw-step3" style="display: none">
                <div class="row p-2">
                    <h3>&#9314 Complete withdrawal:</h3>
                    <form class="d-grid gap-3">
                        <div class="form-group">
                            <label for="withdraw-address">Address:</label>
                            <input type="text" class="form-control" id="withdraw-address">
                            <small id="help-address" class="form-text" style="display: none">Address is invalid</small>
                        </div>
                        <div class="form-group">
                            <label for="withdraw-amount">Amount:</label>
                            <input type="text" class="form-control" id="withdraw-amount">
                        </div>
                        <div class="form-group">
                            <label for="withdraw-fee">Fee:</label>
                            <input type="text" class="form-control" id="withdraw-fee">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- Right column -->
        <div class="col-12 col-lg-3 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h3>Last withdrawals</h3>
            </div>
            
            <div id="recent-tx-data">
            </div>
        
        <!-- / Right column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/js/recent_tx.js"></script>
        <script src="/wallet/withdraw.js"></script>
        
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

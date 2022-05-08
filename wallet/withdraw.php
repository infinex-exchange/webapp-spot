<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <?php include('../imports/bignumber.html'); ?>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../js/ajax_scroll.js'); ?>"></script>
        <title>Withdrawal | Vayamos Exchange</title>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 p-0 user-only">
        <div class="row m-0 h-rest">
        
        <!-- Main column -->
        <div class="col-12 col-lg-9 p-0 ui-card ui-column">
        
            <div class="row py-2">
                <h2>Withdraw</h2>
            </div>
            
            <div class="row py-2">
                <div class="col-12">
                    <h3>&#9312 Select coin to withdraw:</h3>
                </div>
                <div class="col-12 col-lg-6">
                    <?php include('../templates/select_coin.php'); ?>
                </div>
            </div>
            
            <div id="withdraw-step2" style="display: none">
                <div class="row py-2">
                    <div class="col-12">
                        <h3>&#9313 Select withdrawal network:</h3>
                    </div>
                    <div class="col-12 col-lg-6">
                        <?php include('../templates/select_net.php'); ?>
                    </div>
                </div>
            </div>
            
            <div id="withdraw-step3" style="display: none">
                <div class="row py-2">
                    <div class="col-12">
                        <h3>&#9314 Complete withdrawal:</h3>
                    </div>
                    <div class="col-12 col-lg-6">
                        <div id="withdraw-operating-warning" class="alert alert-danger d-flex align-items-center my-2" role="alert">
                            <div class="px-2">
                                <i class="fa-solid fa-plug-circle-xmark fa-2x"></i>
                            </div>
                            <div class="px-2">
                                Looks like our connection to this network is not working properly.<br>
                                You can request a withdrawal as normal, but it will be processed with delay.
                            </div>
                        </div>
                        <form class="d-grid gap-3">
                            <div class="form-group">
                                <label for="withdraw-address">Address:</label>
                                <input type="text" class="form-control" id="withdraw-address">
                                <small id="help-address" class="form-text" style="display: none">Address is invalid</small>
                            </div>
                            <div class="form-group" id="withdraw-memo-wrapper">
                                <label for="withdraw-memo">Memo/tag:</label>
                                <input type="text" class="form-control" id="withdraw-memo" placeholder="Optional">
                                <small id="help-memo" class="form-text" style="display: none">Memo/tag is invalid</small>
                            </div>
                            <div class="form-group">
                                <label for="withdraw-amount">Amount:</label>
                                <input type="text" class="form-control" id="withdraw-amount">
                            </div>
                            <div class="form-group">
                                <span class="range-value" for="withdraw-amount-range" suffix="%"></span>
                                <input id="withdraw-amount-range" type="range" class="form-range" min="0" max="100" step="1" value="0">
                            </div>
                            <div class="form-group">
                                <label for="withdraw-fee">Fee:</label>
                                <input type="text" class="form-control" id="withdraw-fee" readonly>
                            </div>
                            <div class="form-group">
                                <input id="withdraw-fee-range" type="range" class="form-range" min="0" max="1" step="1" value="0">
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
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
        
        <script src="/js/recent_tx.js?<?php echo filemtime(__DIR__.'/../js/recent_tx.js'); ?>"></script>
        <script src="/wallet/withdraw.js?<?php echo filemtime(__DIR__.'/withdraw.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

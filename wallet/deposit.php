<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../js/ajax_scroll.js'); ?>"></script>
        <?php include('../imports/qrcode.html'); ?>
        <title>Deposit | Vayamos Exchange</title>
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
                <h2>Deposit</h2>
            </div>
            
            <div class="row py-2">
                <h3>&#9312 Select coin to deposit:</h3>
                <?php include('../templates/select_coin.php'); ?>
            </div>
            
            <div id="deposit-step2" style="display: none">
                <div class="row py-2">
                    <h3>&#9313 Select deposit network:</h3>
                    <?php include('../templates/select_net.php'); ?>
                </div>
            </div>
            
            <div id="deposit-step3" style="display: none">
                <div class="row py-2">
                    <h3>&#9314 Complete deposit:</h3>
                </div>
                
                <div class="row">
                    <div class="col-12 col-lg-auto p-4 text-center">
                        <div class="qrcode-wrapper d-inline-block">
                            <div id="deposit-qrcode"></div>
                        </div>
                    </div>
                    
                    <div class="col-12 col-lg-auto p-4">
                        <div class="row">
                            <div class="col-12">
                                <span class="secondary">Address:</span>
                            </div>
                        </div>
                        <div class="row flex-nowrap">
                            <div class="col-10 col-lg-auto my-auto">
                                <h4 class="wrap" id="deposit-addr"></h4>
                            </div>
                            <div class="col-auto my-auto">
                                <a href="#_" class="secondary copy-button" data-copy="#deposit-addr"><i class="fa-solid fa-copy fa-xl"></i></a>
                            </div>
                        </div>
                        <div id="deposit-memo-wrapper">
                            <div class="row mt-3">
                                <div class="col-12">
                                    <span class="secondary">Memo/tag:</span>
                                </div>
                            </div>
                            <div class="row flex-nowrap">
                                <div class="col-10 col-lg-auto my-auto">
                                    <h4 class="wrap" id="deposit-memo"></h4>
                                </div>
                                <div class="col-auto my-auto">
                                    <a href="#_" class="secondary copy-button" data-copy="#deposit-memo"><i class="fa-solid fa-copy fa-xl"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-5">
                            <div class="col-12">
                                <span class="secondary">Confirmations target:</span><br>
                                <h5 class="wrap d-inline" id="deposit-confirmations"></h5>
                                <h5 class="d-inline">confirmations</h5>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- Right column -->
        <div class="col-12 col-lg-3 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h3>Last deposits</h3>
            </div>
            
            <div id="recent-tx-data">
            </div>
        
        <!-- / Right column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/js/recent_tx.js?<?php echo filemtime(__DIR__.'/../js/recent_tx.js'); ?>"></script>
        <script src="/wallet/deposit.js?<?php echo filemtime(__DIR__.'/deposit.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

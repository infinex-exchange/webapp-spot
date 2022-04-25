<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <title>Fees | Vayamos Exchange</title>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest background">
        
            <div class="row p-2">
                <h2>Fees</h2>
            </div>
            
            <div class="row p-2">
                <h3>Spot trading</h3>
            </div>
            
            <div class="row p-2 ui-card-high">
            <div class="col-12">
            
                <div class="row p-2">
                    <div class="col">
                        <h5>Level</h5>
                    </div>
                    <div class="col text-end">
                        <h5>30d trade volume</h5>
                    </div>
                    <div class="col text-end">
                        <h5>Hold</h5>
                    </div>
                    <div class="col">
                        <h5>Maker fee</h5>
                    </div>
                    <div class="col">
                        <h5>Taker fee</h5>
                    </div>
                </div>
                
                <div id="spot-fees-data">
                </div>
            
            </div>
            </div>
            
            <div class="row p-2">
                <h3>Deposits and withdrawals</h3>
            </div>
            
            <div class="row p-2 ui-card-high">
            <div class="col-12">
            
                <div class="row p-2">
                    <div class="col">
                        <h5>Asset</h5>
                    </div>
                    <div class="col">
                        <h5>Network</h5>
                    </div>              
                    <div class="col text-end">
                        <h5>Deposit fee</h5>
                    </div>
                    <div class="col text-end">
                        <h5>Withdrawal fee</h5>
                    </div>
                </div>
                
                <div id="withdrawal-fees-data">
                </div>
            
            </div>
            </div>
        
        <!-- / Root container -->
        </div>
        
        <script src="/info/fees.js?<?php echo filemtime(__DIR__.'/fees.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/footer.html'); ?>
    
    </body>
</html>

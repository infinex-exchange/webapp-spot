<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 pt-2 container-rest">
        <div class="row m-0 h-100">
        
        <!-- Main column -->
        <div class="col-12 p-0 ui-card-high">
        
            <div class="row p-2">
                <h1>Fees</h1>
            </div>
            
            <div class="row p-2 text-hi">
                <div class="col">
                    Level
                </div>
                <div class="col text-end">
                    30d trade volume
                </div>
                <div class="col text-end">
                    Hold
                </div>
                <div class="col">
                    Maker fee
                </div>
                <div class="col">
                    Taker fee
                </div>
            </div>
            
            <div id="fees-data">
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- / Root container -->
        </div>
        </div>
        
        <script src="/info/fees.js"></script>
    
    </body>
</html>

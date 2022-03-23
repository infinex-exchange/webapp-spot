<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/validate.js"></script>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest pt-2 user-only">
        <div class="row m-0 h-100">
        
        <!-- Left column -->
        <?php include('../templates/sidebar_account.php'); ?>
        
        <!-- Main column -->
        <div class="col-12 col-lg-8 p-0 ui-card ui-column">
            
            <div class="row p-2">
                <h1>Sessions list</h1>
            </div>
            
            <div class="row p-2 text-hi">
                <div class="col-2">
                Session ID
                </div>
                <div class="col-3">
                Info
                </div>
                <div class="col-4">
                Last activity
                </div>
                <div class="col-3">
                Options
                </div>
            </div>
            
            <div id="sessions-data">
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/account/sessions.js"></script>
        
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

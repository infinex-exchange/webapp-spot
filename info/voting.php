<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../js/ajax_scroll.js'); ?>"></script>
        <title>Vote for listing | Vayamos Exchange</title>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 p-0 background">
        <div class="row m-0 h-rest">
        
        <!-- Left column -->
        <?php include('../templates/sidebar_info.php'); ?>
        
        <!-- Main column -->
        <div class="col-12 col-lg-9 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <div class="col-auto my-auto">
                    <h2>Vote for listing</h2>
                </div>
                <div class="col-auto ms-auto my-auto">
                    <a href="#_" class="btn btn-primary">
                        <i class="submit-project fa-solid fa-plus"></i>
                        Submit project
                    </a>
                </div>
            </div>
            
            <div class="row p-2">
                <h3>Current voting</h3>
            </div>
            
            <div class="row p-2 ui-card-light">
            <div class="col-12">
                
                <div id="no-voting" class="d-none text-center py-2">
                    <h4 class="secondary">There is no active voting at the moment</h4>
                </div>
                
                <div id="current-voting-data">
                </div>
            
            </div>
            </div>
            
            <div class="row p-2">
                <h3>Previous votings</h3>
            </div>
            
            <div class="row p-2 ui-card-light">
            <div class="col-12">
                <div id="previous-votings-data">
                </div>
            </div>
            </div>
        
        <!-- / Main column -->
        </div>
        
        <!-- / Root container -->
        </div>
        </div>
        
        <script src="/info/voting.js?<?php echo filemtime(__DIR__.'/voting.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/footer.html'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <title>Listing | Vayamos Exchange</title>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 h-rest background">
        
        <!-- Left column -->
        <?php include('../templates/sidebar_info.php'); ?>
        
        <!-- Main column -->
        <div class="col-12 col-lg-8 p-0 ui-card ui-column">
        
            <div class="row p-2">
                <h2>Listing</h2>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                Want your coin to be listed on our exchange? We are open to cooperation.
                Vayamos Exchange is a good place to launch a new crypto project.<br>
                Contact us at the following e-mail address to arrange a listing:
            </div>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                <a href="mailto:listing@vayamos.cc" class="btn btn-primary">
                    <i class="fa-solid fa-envelope"></i>
                    listing@vayamos.cc
                </a>
            </div>
            </div>
            
            <div class="row p-2 pt-4">
                <h3>Listing fee</h3>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                ...
            </div>
            </div>
            
        <!-- / Main column -->
        </div>
        
        <!-- / Root container -->
        </div>
        
        <script src="/info/listing.js?<?php echo filemtime(__DIR__.'/listing.js'); ?>"></script>
        
        <?php include('../templates/footer.html'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

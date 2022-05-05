<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <?php include('../imports/marked.html'); ?>
        <script src="/js/ajax_scroll.js?<?php echo filemtime(__DIR__.'/../js/ajax_scroll.js'); ?>"></script>
        <title>Announcements | Vayamos Exchange</title>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 h-rest background">
        
            <div class="row p-2">
                <h2>Announcements</h2>
            </div>
            
            <div id="announcements-data">
            </div>
        
        <!-- / Root container -->
        </div>
        
        <script src="/info/announcements.js?<?php echo filemtime(__DIR__.'/announcements.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/footer.html'); ?>
    
    </body>
</html>

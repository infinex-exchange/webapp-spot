<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <?php include('../templates/marked.html'); ?>
        <script src="/js/ajax_scroll.js"></script>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest background">
        
            <div class="row p-2">
                <h2>Announcements</h2>
            </div>
            
            <div id="announcements-data">
            </div>
        
        <!-- / Root container -->
        </div>
        
        <script src="/info/announcements.js"></script>
        
        <?php include('../templates/modals.html'); ?>
        <?php include('../templates/footer.html'); ?>
    
    </body>
</html>

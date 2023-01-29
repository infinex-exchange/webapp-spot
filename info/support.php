<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <title>Rules | Infinex</title>
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
                <h2>Support</h2>
            </div>
            
            <div class="row">
                <div class="support-menu col-12 p-2">
                    <p>
                        This is the official Infinex support contact form. We do not respond to requests sent in any other way, like social media.
                        We'll respond to your request by e-mail, usually within 48 hours, excluding Saturdays and Sundays.
                        Please select the subject of your request.
                    </p>
                    
                    <div class="list-group list-group-flush">
                        <button type="button" class="list-group-item list-group-item-action">
                            I'm having trouble with login or registration
                        </button>
                        <button type="button" class="list-group-item list-group-item-action">
                            I have an issue with my deposit
                        </button>
                        <button type="button" class="list-group-item list-group-item-action">
                            I have an issue with my withdrawal
                        </button>
                        <button type="button" class="list-group-item list-group-item-action">
                            I have an issue with other services
                        </button>
                    </div>
                </div>
                
                <div class="col-12 p-2">
                    <strong>2.</strong> We are using various technologies on many different networking layers, making it impossible to track
                    our exchange datacenter physical location. Therefore, slow pages loading and temporary downtimes not exceeding a few minutes should
                    be considered as completely normal.
                </div>
                
                <div class="col-12 p-2">
                    <strong>3.</strong> Only e-mail address and password are needed to create an account allowing access to all features of the exchange.
                </div>
                
                <div class="col-12 p-2">
                    <strong>4.</strong> We provide technical support to our users. The only allowed way of reporting issues is the contact form
                    available at Info -> Support. Any issue reports submitted by other ways (e.g. on social media) will be ignored.
                </div>
                
                <div class="col-12 p-2">
                    <strong>5.</strong> We do not provide any technical support for assets marked as experimental (the red alert on deposit/withdrawal page,
                    the red flask icon in the trading interface)
                </div>
            </div>
            
        <!-- / Main column -->
        </div>
        
        <!-- / Root container -->
        </div>
        </div>
        
        <script src="/info/listing.js?<?php echo filemtime(__DIR__.'/listing.js'); ?>"></script>
        
        <?php include('../templates/footer.html'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

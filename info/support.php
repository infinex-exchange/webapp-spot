<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <title>Support | Infinex</title>
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
                <div class="col-12 p-2">
                    <p>
                        This is the official Infinex support contact form. We do not respond to requests sent in any other way, like social media.
                        We'll respond to your request by e-mail, usually within 48 hours, excluding Saturdays and Sundays.
                        Please select the subject of your request.
                    </p>
                </div>
                <div id="support-menu" class="col-12 p-2">
                    <div class="list-group list-group-flush">
                        <button type="button" class="list-group-item list-group-item-action" data-goto="support-login" data-for="guest">
                            I'm having trouble with login or registration
                        </button>
                        <button type="button" class="list-group-item list-group-item-action" data-goto="support-deposit" data-for="user">
                            I have an issue with my deposit
                        </button>
                        <button type="button" class="list-group-item list-group-item-action" data-goto="support-withdrawal" data-for="user">
                            I have an issue with my withdrawal
                        </button>
                        <button type="button" class="list-group-item list-group-item-action" data-goto="support-other" data-for="guest,user">
                            I have an issue with other services
                        </button>
                    </div>
                </div>
                
                <div id="support-login" class="col-12 p-2">
                    <div class="row">
                    
                    
                        <div class="col-12 pb-1">
                            <h5 class="secondary">Your e-mail address:</h5>
                        </div>
                        <div class="col-12 col-lg-6 pb-2">
                            <input id="sl-email" type="email" class="form-control">
                        </div>
    
    
                        <div class="col-12 pb-1">
                            <h5 class="secondary">Please describe the problem:</h5>
                        </div>
                        <div class="col-12 col-lg-6">
                            <textarea id="sl-description" class="form-control"></textarea>
                        </div>
                        
                        
                        <div class="col-12">
                            <button id="sl-submit" type="button" class="btn btn-primary">Submit</button>
                        </div>
                        
                        
                    </div>
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

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
                
                <div id="support-login" class="col-12 p-2 d-none">
                    <div class="row">
                    
                    
                        <div class="col-12 pb-1">
                            <h5 class="secondary">Your e-mail address:</h5>
                        </div>
                        <div class="col-12 col-lg-6">
                            <input id="sl-email" type="email" class="form-control">
                        </div>
    
    
                        <div class="col-12 pt-3 pb-1">
                            <h5 class="secondary">Please describe the problem:</h5>
                        </div>
                        <div class="col-12">
                            <textarea id="sl-description" class="form-control"></textarea>
                        </div>
                        
                        
                        <div class="col-12 pt-3">
                            <button id="sl-submit" type="button" class="btn btn-primary">Submit</button>
                        </div>
                        
                        
                    </div>
                </div>
                
                <div id="support-deposit" class="col-12 p-2">
                    <div class="row">
                    
                    
                        <div class="col-12 pb-1">
                            <h5 class="secondary">Has the full 8 hours passed since the deposit was made?</h5>
                        </div>
                        <div class="col-6 col-lg-3">
                            <button id="sl-submit" type="button" class="btn btn-primary w-100">Yes</button>
                        </div>
                        <div class="col-6 col-lg-3">
                            <button id="sl-submit" type="button" class="btn btn-primary w-100">No</button>
                        </div>
                    
                    
                    </div>
                </div>
                
                <div id="support-deposit-gt8h" class="col-12 p-2">
                    <div class="row">
                        
                        
                        <div class="col-12 pb-1">
                            <h5 class="secondary">Which coin did you deposited?</h5>
                        </div>
                        <div class="col-12 col-lg-6">
                            <?php include('../templates/select_coin.php'); ?>
                        </div>
    
    
                        <div class="col-12 pt-3 pb-1">
                            <h5 class="secondary">Which network did you use?</h5>
                        </div>
                        <div class="col-12 col-lg-6">
                            <?php include('../templates/select_net.php'); ?>
                        </div>
                        
                        
                        <div class="col-12 pt-3">
                            <button id="sl-submit" type="button" class="btn btn-primary">Submit</button>
                            <button id="sl-submit" type="button" class="btn btn-primary">Submit</button>
                        </div>
                        
                        
                    </div>
                </div>
                
                <div id="support-deposit-lt8h" class="col-12 p-2">
                    <div class="alert alert-danger d-flex align-items-center my-2" role="alert">
                        <div class="px-2">
                            <i class="fa-solid fa-plug-circle-xmark fa-2x"></i>
                        </div>
                        <div class="px-2">
                            <h5>We can't accept your request right now</h5>
                            Most deposit issues are temporary only and will resolve automatically after a few minutes or hours.<br>
                            Perhaps our technicians are already working on fixing this issue.<br>
                            You can submit a support request only if a full 8 hours have passed since the deposit was made.<br>
                            Attempts to work around this question will remain unanswered.
                        </div>
                    </div>
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

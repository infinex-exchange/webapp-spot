<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/validate.js?<?php echo filemtime(__DIR__.'/../js/validate.js'); ?>"></script>
        <title>Security settings | Vayamos Exchange</title>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 p-0 user-only">
        <div class="row m-0 h-rest">
        
        <!-- Left column -->
        <?php include('../templates/sidebar_account.php'); ?>
        
        <!-- Main column -->
        <div class="col-12 col-lg-8 p-0 ui-card ui-column">
            
            <div class="row p-2">
                <h3>Active sessions</h3>
            </div>
            
            <div class="row p-2 secondary">
                <div style="width: 17%">
                <h5>Session ID</h5>
                </div>
                <div style="width: 20%">
                <h5>Info</h5>
                </div>
                <div style="width: 38%">
                <h5>Last activity</h5>
                </div>
                <div style="width: 25%">
                <h5>Options</h5>
                </div>
            </div>
            
            <div id="sessions-data">
            </div>
            
            <div class="row">
                <div class="col-12 col-md-6">
                    <div class="row p-2 pt-4">
                        <h3>Change password</h3>
                    </div>  
                    
                    <form id="chp-form" class="d-grid gap-3">
                        <div class="form-group">
                            <label for="chp-old">Old password:</label>
                            <input type="password" class="form-control" id="chp-old">
                            <small id="help-chp-old" class="form-text" style="display: none">
                                The password must be at least 8 characters long and contain
                                one lowercase letter, one uppercase letter, and one digit
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="chp-new">New password:</label>
                            <input type="password" class="form-control" id="chp-new">
                            <small id="help-chp-new" class="form-text" style="display: none">
                                The password must be at least 8 characters long and contain
                                one lowercase letter, one uppercase letter, and one digit
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="chp-new2">Confirm password:</label>
                            <input type="password" class="form-control" id="chp-new2">
                            <small id="help-chp-new2" class="form-text" style="display: none">Passwords does not match</small>
                        </div>
                        <button type="submit" class="btn btn-primary">Change password</button>
                    </form>
                </div>
                
                <div class="col-12 col-md-6">
                    <div class="row p-2 pt-4">
                        <h3>Change e-mail</h3>
                    </div>  
                    
                    <form id="che-form" class="d-grid gap-3">
                        <div class="form-group">
                            <label for="che-email">New e-mail:</label>
                            <input type="text" class="form-control" id="che-email">
                            <small id="help-che-email" class="form-text" style="display: none">
                                Incorrect e-mail format
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="che-password">Current password:</label>
                            <input type="password" class="form-control" id="che-password">
                            <small id="help-che-password" class="form-text" style="display: none">
                                The password must be at least 8 characters long and contain
                                one lowercase letter, one uppercase letter, and one digit
                            </small>
                        </div>
                        <button type="submit" class="btn btn-primary">Change e-mail</button>
                    </form>
                </div>
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/account/security.js?<?php echo filemtime(__DIR__.'/security.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

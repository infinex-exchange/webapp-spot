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
                <h5 class="d-none d-lg-block">Session ID</h5>
                <h5 class="d-lg-none">SID</h5>
                </div>
                <div style="width: 21%">
                <h5>Info</h5>
                </div>
                <div style="width: 37%">
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
                        <div class="form-group che-step1">
                            <label for="che-email">New e-mail:</label>
                            <input type="text" class="form-control" id="che-email">
                            <small id="help-che-email" class="form-text" style="display: none">
                                Incorrect e-mail format
                            </small>
                        </div>
                        <div class="form-group che-step1">
                            <label for="che-password">Current password:</label>
                            <input type="password" class="form-control" id="che-password">
                            <small id="help-che-password" class="form-text" style="display: none">
                                The password must be at least 8 characters long and contain
                                one lowercase letter, one uppercase letter, and one digit
                            </small>
                        </div>
                        <div id="che-pending" class="alert alert-secondary align-items-center" role="alert">
                            <div class="px-2">
                                <i class="fa-solid fa-hourglass fa-2x"></i>
                            </div>
                            <div class="px-2">
                                Pending e-mail change to:<br>
                                <strong id="che-pending-email"></strong>
                            </div>
                            <div class="ms-auto px-2">
                                <button type="button" class="btn btn-primary btn-sm" id="che-cancel">Cancel</button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="che-code">Verification code:</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="che-code">
                                <button type="button" id="che-code-get" class="btn btn-primary">Get</button>
                            </div>
                            <small id="help-che-code" class="form-text" style="display: none">
                                8 characters, only alphanumeric
                            </small>
                        </div>
                        <button id="che-submit-btn" type="submit" class="btn btn-primary">Change e-mail</button>
                    </form>
                </div>
                
                <!--
                <div class="col-12">
                    <div class="row p-2 pt-4">
                        <h3>Two factor authentication</h3>
                    </div>  
                    
                    <div class="row p-2">
                        <div class="col-12 col-lg-6">
                            <div class="alert alert-secondary d-flex align-items-center" role="alert">
                                <div class="px-2">
                                    <i class="fa-solid fa-envelope fa-2x"></i>
                                </div>
                                <div class="px-2">
                                    E-mail codes<br>
                                    <strong class="text-success">Available</strong>
                                    <strong class="text-success">Active</strong>
                                </div>
                                <div class="ms-auto px-2">
                                    <button type="button" class="btn btn-primary btn-sm">Use</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 col-lg-6">
                            <div class="alert alert-secondary d-flex align-items-center" role="alert">
                                <div class="px-2">
                                    <i class="fa-brands fa-google fa-2x"></i>
                                </div>
                                <div class="px-2">
                                    Google Authenticator<br>
                                    <strong class="text-success">Available</strong>
                                    <strong class="text-success">Active</strong>
                                    <strong class="text-danger">Not available</strong>
                                </div>
                                <div class="ms-auto px-2">
                                    <button type="button" class="btn btn-primary btn-sm">Configure</button>
                                    <button type="button" class="btn btn-primary btn-sm">Remove</button>
                                    <button type="button" class="btn btn-primary btn-sm">Use</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row p-2">
                        <div class="col-12 col-lg-3 pb-1 pb-lg-0 my-auto">
                            <h5>Login to account</h5>
                        </div>
                        
                        <div class="col-12 col-lg-9 my-auto">
                            <div class="pretty p-default p-round p-bigger">
                                <input type="radio" name="2fa-login">
                                <div class="state">
                                    <label>Disabled</label>
                                </div>
                            </div>
                        
                            <div class="pretty p-default p-round p-bigger">
                                <input type="radio" name="2fa-login">
                                <div class="state">
                                    <label>E-mail</label>
                                </div>
                            </div>
                        
                            <div class="pretty p-default p-round p-bigger">
                                <input type="radio" name="2fa-login">
                                <div class="state">
                                    <label>Google</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row p-2">
                        <div class="col-12 col-lg-3 pb-1 pb-lg-0 my-auto">
                            <h5>Withdraw funds</h5>
                        </div>
                        
                        <div class="col-12 col-lg-9 my-auto">
                            <div class="pretty p-default p-round p-bigger">
                                <input type="radio" name="2fa-withdraw">
                                <div class="state">
                                    <label>Disabled</label>
                                </div>
                            </div>
                        
                            <div class="pretty p-default p-round p-bigger">
                                <input type="radio" name="2fa-withdraw">
                                <div class="state">
                                    <label>E-mail</label>
                                </div>
                            </div>
                        
                            <div class="pretty p-default p-round p-bigger">
                                <input type="radio" name="2fa-withdraw">
                                <div class="state">
                                    <label>Google</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row p-2">
                        <div class="col-12 col-lg-6">
                            <button type="button" class="btn btn-primary w-100">Save</button>
                        </div>
                    </div>
                    
                </div>
                -->
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

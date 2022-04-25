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
        <?php include('../templates/navbar.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest pt-2 user-only">
        <div class="row m-0 h-100">
        
        <!-- Left column -->
        <?php include('../templates/sidebar_account.php'); ?>
        
        <!-- Main column -->
        <div class="col-12 col-lg-8 p-0 ui-card ui-column">
            
            <div class="row p-2">
                <h3>Sessions list</h3>
            </div>
            
            <div class="row p-2">
                <div class="col-2">
                <h5>Session ID</h5>
                </div>
                <div class="col-3">
                <h5>Info</h5>
                </div>
                <div class="col-4">
                <h5>Last activity</h5>
                </div>
                <div class="col-3">
                <h5>Options</h5>
                </div>
            </div>
            
            <div id="sessions-data">
            </div>
            
            <div class="row p-2">
                <h3>Change password</h3>
            </div>
            
            <div class="row p-2">
                <form id="chp-form" class="d-grid gap-3">
                        <div class="form-group">
                            <label for="chp-old">Old password:</label>
                            <input type="password" class="form-control" id="chp-old">
                            <small id="help-chp-old" class="form-text" style="display: none">Password a-a A-A 0-0 x8</small>
                        </div>
                        <div class="form-group">
                            <label for="chp-new">New password:</label>
                            <input type="password" class="form-control" id="chp-new">
                            <small id="help-chp-new" class="form-text" style="display: none">Password a-a A-A 0-0 x8</small>
                        </div>
                        <div class="form-group">
                            <label for="chp-new2">Confirm password:</label>
                            <input type="password" class="form-control" id="chp-new2">
                            <small id="help-chp-new2" class="form-text" style="display: none">Passwords not match</small>
                        </div>
                        <button type="submit" class="btn btn-primary">Change password</button>
                    </form>
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/account/security.js"></script>
        
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

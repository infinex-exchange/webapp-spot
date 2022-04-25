<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/validate.js"></script>
    </head>
    <body class="vh-100 body-background">
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 pt-2 guest-only container-rest">
        <div class="row m-0 h-100">
        
        <!-- Main column -->
        <div class="col-12 col-lg-6 m-auto ui-card-high rounded">
        <div class="row m-0">
            
            <!-- Left -->
            <div class="col-12 col-lg-7 p-4">
            
                <h2 class="pb-4">Register</h2>
                <p>Your account has been created. Verification code sent to e-mail address: <strong id="verify-email-addr"></strong>.</p>
                
                <form id="verify-form" class="d-grid gap-3">
                    <div class="form-group">
                        <label for="verify-code">Verification code:</label>
                        <input type="text" class="form-control" id="verify-code">
                        <small id="help-code" class="form-text" style="display: none">8 characters, only alphanumeric</small>
                    </div>
                    <button type="submit" class="btn btn-primary">Confirm</button>
                </form>
            
            <!-- / Left -->
            </div>
            
            <!-- Right -->
            <div class="col-12 col-lg-5 p-4 my-auto">
                <div class="row py-3">
                    <div class="col-auto my-auto text-center" style="width: 60px">
                        <i style="color: var(--color-ultra)" class="fa-solid fa-lock fa-2x"></i>
                    </div>
                    <div class="col font-1 my-auto">
                        Make sure you are visiting:<br>
                        <strong class="text-hi">https://vayamos.cc</strong>
                    </div>
                </div>
                <div class="row py-3">
                    <div class="col-auto my-auto text-center" style="width: 60px">
                        <i style="color: var(--color-ultra)" class="fa-solid fa-user fa-2x"></i>
                    </div>
                    <div class="col font-1 my-auto">
                        <a class="link-ultra" href="/account/login">Back to login</a>
                    </div>
                </div>
            </div>
            <!-- / Right -->
            
        
        <!-- / Main column -->
        </div>
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/account/verify.js"></script>
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

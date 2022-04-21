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
        <?php include('../templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 pt-2 guest-only container-rest">
        <div class="row m-0 h-rest">
        
        <!-- Main column -->
        <div class="col-12 col-lg-6 m-auto ui-card-high rounded">
        <div class="row m-0">
        
            <!-- Left -->
            <div class="col-12 col-lg-7 p-4">
            
            <h1 class="pb-4">Vayamos Exchange Registration</h1>
            <p>Enter your account details.</p>
        
            <div id="reg-form-step1-wrapper">
            <form id="reg-form-step1" class="d-grid gap-3">
                <div class="form-group">
                    <label for="reg-email">Email:</label>
                    <input type="email" class="form-control" id="reg-email">
                    <small id="help-email" class="form-text" style="display: none">Incorrect e-mail format</small>
                </div>
                <div class="form-group">
                    <label for="reg-password">Password:</label>
                    <input type="password" class="form-control" id="reg-password">
                    <small id="help-password" class="form-text" style="display: none">Password a-a A-A 0-0 x8</small>
                </div>
                <div class="form-group">
                    <label for="reg-password2">Confirm password:</label>
                    <input type="password" class="form-control" id="reg-password2">
                    <small id="help-password2" class="form-text" style="display: none">Passwords not match</small>
                </div>
                <button type="submit" class="btn btn-primary">Next</button>
            </form>
            </div>
            
            <div id="reg-form-step2-wrapper">
            <form id="reg-form-step2" class="d-grid gap-3">
                <div class="form-group">
                    <img id="reg-captcha-img" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">
                    <button id="reg-captcha-change" type="button" class="btn btn-primary">
                        <i class="fa-solid fa-repeat"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label for="reg-captcha">Captcha:</label>
                    <input type="text" class="form-control" id="reg-captcha">
                    <small id="help-captcha" class="form-text" style="display: none">Captcha must be 4 characters length, case-ignored, no 0 digit and O letters</small>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
            </div>
            
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
                        Already have account?<br>
                        <a class="link-ultra" href="/account/login">Login now</a>
                    </div>
                </div>
            </div>
            <!-- / Right -->
            
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <script src="/account/register.js"></script>
        <?php include('../templates/modals.html'); ?>
    
    </body>
</html>

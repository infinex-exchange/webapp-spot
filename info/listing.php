<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <title>Listing | Vayamos Exchange</title>
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
                <h2>Listing</h2>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                Vayamos Exchange is a good place to launch a new crypto project.
                Want your coin to be listed on our exchange?
                <br>
                Contact us at the e-mail address below to arrange a listing.
                We are open to cooperation.
            </div>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                <a href="mailto:listing@vayamos.cc" class="btn btn-primary">
                    <i class="fa-solid fa-envelope"></i>
                    listing@vayamos.cc
                </a>
            </div>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                Please submit the following information about your project in the message:
                <ul>
                    <li>Token full name</li>
                    <li>Token symbol</li>
                    <li>Project chain (e.g. ERC-20, TRC-20, own blockchain)</li>
                    <li>Official website</li>
                    <li>Exchanges it has been already listed on</li>
                    <li>Your position with this project</li>
                    <li>Suggested listing date and time</li>
                </ul>
            </div>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                Please make sure you contact us using the project's official email address,
                which can be found on its official website or in social media.
            </div>
            </div>
            
            <div class="row p-2 pt-4">
                <h3>Listing fee</h3>
            </div>
            
            <div class="row p-2">
            <div class="col-12">
                <ul>
                    <li class="py-1">
                        Standard token on already supported blockchain<br>
                        <i>e.g. your project is TRC-20 token</i><br>
                        <strong>FREE LISTING</strong>
                    </li>
                    <li class="py-1">
                        Own blockchain, with compatible RPC interface<br>
                        <i>e.g. your project is fork of Chia, with the same RPC interface, and we're already supporting Chia</i><br>
                        <strong>FREE LISTING</strong>
                    </li>
                    <li class="py-1">
                        Own blockchain, with incompatible RPC interface<br>
                        <i>e.g. your project is a custom blockchain created from the scratch</i><br>
                        <strong>FREE LISTING</strong> - if you develop and provide the integration plugin on your own
                        in accordance with the template available on our GitHub<br>
                        Otherwise, you have to pay for the listing in our BPX token, and the price depends
                        on the complexity of your project.
                    </li>
                </ul>
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

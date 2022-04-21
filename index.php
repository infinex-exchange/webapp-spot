<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('templates/head.php'); ?>
    </head>
    <body class="body-background">
    
        <!-- Preloader -->
        <?php include('templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('templates/navbar.html'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 pt-2 container-rest p-0">
        
            <div class="row m-0 px-4 py-5">
                <div class="jumbotron col-12">
                    <h1>Vayamos Exchange</h1>
                    <p>Official digital assets exchange of BPX ecosystem.</p>
                    <a href="/spot" class="btn btn-primary">START TRADING</a>
                </div>
            </div>
        
            <div class="row gx-0 gx-lg-3 gy-3 m-0 mx-lg-5">
                <div class="col-12">
                    <div class="p-4 ui-card-high rounded">
                        <div class="row py-2 text-center">
                            <h1>Market trend</h1>
                        </div>
                        <div class="row text-hi py-2">
                            <div class="col-3">Name</div>
                            <div class="col-3 text-end">Last price</div>
                            <div class="col-3 text-end">24h change</div>
                            <div class="col-3 text-end">Market cap</div>
                        </div>            
                        <div id="market-trend-spot-data"></div>
                    </div>
                </div>

                <div class="col-12 col-lg-6">
                    <div class="p-4 ui-card-high rounded">
                        <div class="row py-2 text-center">
                            <h1>Top gainers</h1>
                        </div>
                        <div class="row text-hi py-2">
                            <div class="col-3">Name</div>
                           <div class="col-3 text-end">Last price</div>
                            <div class="col-3 text-end">24h change</div>
                            <div class="col-3 text-end">Market cap</div>
                        </div>
                        <div id="top-gainers-spot-data"></div>
                    </div>
                </div>
                
                <div class="col-12 col-lg-6">
                    <div class="p-4 ui-card-high rounded">
                        <div class="row py-2 text-center">
                            <h1>Top losers</h1>
                        </div>                    
                        <div class="row text-hi py-2">
                            <div class="col-3">Name</div>
                            <div class="col-3 text-end">Last price</div>
                            <div class="col-3 text-end">24h change</div>
                            <div class="col-3 text-end">Market cap</div>
                        </div>                    
                        <div id="top-losers-spot-data"></div>
                    </div>
                </div>
            </div>
            
            <div class="row m-0 px-4 py-5 index-section gy-2">
                <div class="col-12">
                    <h2>Exchange as you wanted</h2>
                </div>
                <div class="col-12 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        No KYC. Never.
                    </h3>
                    Only e-mail address and password needed to access all functions of the exchange.
                    No personal details, no verifications.
                    And we promise it won't change.
                </div>
                <div class="col-12 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Flexible security options
                    </h3>
                    Are you annoyed by SMS or 2FA codes every time you open exchange app?
                    In Vayamos, you can use it or you can turn it off.
                    We don't force anything.
                </div>
                <div class="col-12 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Quick & easy listing
                    </h3>
                    We help new crypto projects.
                    Listing on Vayamos is as simple as possible.
                    And if there are no technical barriers, it can be done for free.
                </div>
                <div class="col-12 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        < 0,10%
                    </h3>
                    Competitive transaction fees with the possibility of obtaining discounts.
                </div>
                <div class="col-12 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Instant deposits and withdrawals
                    </h3>
                    When you request a withdrawal it will be executed on the blockchain
                    within no more than 1 minute.
                </div>
                <div class="col-12 col-lg-4">
                    <h3>
                        <i class="fa-solid fa-check-circle"></i>
                        Community support
                    </h3>
                    Get help and discuss anytime on our Discord server
                </div>
            </div>
        
        <!-- / Root container -->
        </div>
        
        <script src="/index.js"></script>
        
        <!-- Footer -->
        <?php include('templates/footer.html'); ?>
    
    </body>
</html>

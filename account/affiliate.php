<!DOCTYPE html>
<html lang="en">
    <head>
        <?php include('../templates/head.php'); ?>
        <script src="/js/validate.js?<?php echo filemtime(__DIR__.'/../js/validate.js'); ?>"></script>
        <title>Affiliate program | Vayamos Exchange</title>
        <style type="text/css">
            @media (min-width: 992px) {
                .reflinks-item ~ .reflinks-item {
                    border-top: 1px solid var(--color-border);
                }
            }
        </style>
    </head>
    <body>
    
        <!-- Preloader -->
        <?php include('../templates/preloader.html'); ?>
        
        <!-- Navbar -->
        <?php include('../templates/navbar.php'); ?>
        
        <!-- Root container -->
        <div id="root" class="container-fluid container-1500 container-rest p-0">
        <div class="row m-0 h-rest">
        
        <!-- Left column -->
        <?php include('../templates/sidebar_account.php'); ?>
        
        <!-- Main column -->
        <div class="col-12 col-lg-8 p-0 ui-card ui-column">
            
            <div class="row p-2">
                <h3>Affiliate program</h3>
            </div>
            
            <div class="row py-3">
                <p>
                Every Vayamos Exchange customer can earn lifetime rewards by simply sharing a personal referral link.
                Invite your friend to the Vayamos Exchange or share a reflink on your website, social media or YouTube channel.
                When users create an account within 3 days after your reflink was clicked, you will receive 20% of the commission paid by this user every month.
                </p>
                <p>
                The affiliate program has four levels, which means that you will also receive profits from people recommended by your referrals.
                The fee refund rate for the following levels is respectively: direct referrals - 20%, 2nd level - 10%, 3rd level - 5%, 4th level - 2.5%.
                </p>
            </div>
            
            <div class="row p-2">
                <div class="col-auto my-auto">
                    <button type="button" class="btn btn-primary btn-sm" onClick="showAddReflinkPrompt()">New reflink</a>
                </div>
            </div>
            
            <div class="row p-2 d-none d-lg-flex secondary">
                <div class="col-4">
                <h5>Name</h5>
                </div>
                <div class="col-5">
                <h5>Members, reflinks</h5>
                </div>
                <div class="col-3">
                <h5>Options</h5>
                </div>
            </div>
            
            <div id="reflinks-data">
            </div>
        
        <!-- / Main column -->
        </div>
            
        <!-- / Root container -->    
        </div>
        </div>
        
        <div class="modal fade" tabindex="-1" role="dialog" id="modal-reflink-details">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Reflink</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="row py-2">
                            <div class="col-4">
                                <h5>Name:</h5>
                            </div>
                            <div class="col-8 text-end">
                                <span id="mrd-description"></span>
                            </div>
                        </div>
                        
                        <div class="py-3"></div>
                        
                        <div class="row py-2">
                            <div class="col-12">
                                <h5>Members:</h5>
                            </div>
                            <div class="col-12">
                                <div id="mrd-members-inner" class="row p-2 flex-nowrap"></div>
                            </div>
                        </div>
                        
                        <div class="py-3"></div>
                        
                        <div class="row py-2">
                            <div class="col-12">
                                <h5>Home page reflink:</h5>
                            </div>
                            <div class="col-12">
                                <div class="row mx-1 my-2 px-1 py-3 flex-nowrap rounded" style="background-color: var(--color-input);">
                                    <div class="col-auto my-auto wrap">
                                        <span class="wrap" id="mrd-reflink-index"></span>
                                    </div>
                                    <div class="col-auto my-auto">
                                        <a href="#_" class="secondary" data-copy="#mrd-reflink-index" onClick="copyButton(this); event.stopPropagation();"><i class="fa-solid fa-copy fa-xl"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row py-2">
                            <div class="col-12">
                                <h5>Register form reflink:</h5>
                            </div>
                            <div class="col-12">
                                <div class="row mx-1 my-2 px-1 py-3 flex-nowrap rounded" style="background-color: var(--color-input);">
                                    <div class="col-auto my-auto wrap">
                                        <span class="wrap" id="mrd-reflink-reg"></span>
                                    </div>
                                    <div class="col-auto my-auto">
                                        <a href="#_" class="secondary" data-copy="#mrd-reflink-reg" onClick="copyButton(this); event.stopPropagation();"><i class="fa-solid fa-copy fa-xl"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button id="mrd-rename-btn" type="button" class="btn btn-primary">Rename</a>
                        <button id="mrd-remove-btn" type="button" class="btn btn-primary">Remove</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" tabindex="-1" role="dialog" id="modal-reflink-desc-prompt">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit reflink</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="reflink-description-form">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="reflink-description">Name:</label>
                        <input type="text" class="form-control" id="reflink-description">
                        <small id="help-reflink-description" class="form-text" style="display: none">Invalid name</small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    </div>
</div>
        
        <script src="/account/affiliate.js?<?php echo filemtime(__DIR__.'/affiliate.js'); ?>"></script>
        
        <?php include('../templates/modals.php'); ?>
        <?php include('../templates/vanilla_mobile_nav.php'); ?>
    
    </body>
</html>

<div class="d-none d-lg-block col-3 p-0 ui-card ui-column">
        
    <div class="row p-2">
        <h1>My account</h1>
    </div>
            
    <?php include('menu_account.html'); ?>
    
</div>

<nav class="navbar fixed-bottom navbar-expand navbar-mobile d-flex d-lg-none py-0">
    <ul class="navbar-nav mx-auto text-center">
        <li class="nav-item">
            <a class="nav-link" href="/">
                <i class="fas fa-home"></i><br>
                Lobby
            </a>
        </li>
        <li class="nav-item dropup">
            <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-info"></i><br>
                Informations
            </a>
            <div class="dropdown-menu">
                <?php include('menu_account.html'); ?>
            </div>
        </li>
    </ul>
</nav>
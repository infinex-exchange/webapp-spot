<div id="select-net-wrapper">
    <form>
        <div class="select-arrow">
            <input readonly id="select-net" type="text" placeholder="Select network" class="form-control">
            <i id="select-net-arrow" class="fa-solid fa-angle-down flippable"></i>
        </div>
    </form>
    <div id="select-net-dropdown">
        <div id="select-net-data" class="scrollable"></div>
    </div>
</div>
<script src="/js/select_net.js?<?php echo filemtime(__DIR__.'/../js/select_net.js'); ?>"></script>
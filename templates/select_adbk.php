<div id="select-adbk-wrapper">
    <div class="select-arrow">
        <input id="select-adbk" type="text" placeholder="Paste address or select from addressbook" class="form-control" autocomplete="off">
        <i id="select-adbk-arrow" class="fa-solid fa-angle-down flippable"></i>
    </div>
    <div id="select-adbk-dropdown">
        <div id="select-adbk-data" class="scrollable"></div>
    </div>
</div>
<script src="/js/select_adbk.js?<?php echo filemtime(__DIR__.'/../js/select_adbk.js'); ?>"></script>
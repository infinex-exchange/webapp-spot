function gotoStep(step) {
    $('.support-step').addClass('d-none');
    $('#' + step).removeClass('d-none');
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
    
    $('[data-goto]').click(function() {
        var datafor = $(this).data('for');
        if(typeof(datafor) !== 'undefined') {
            if(window.loggedIn && !datafor.includes('user')) {
                msgBox('This option cannot be used as a logged in user');
                return;
            }
            if(!window.loggedIn && !datafor.includes('guest')) {
                gotoLogin();
                return;
            }
        }
        
        gotoStep($(this).data('goto'));
    });
});
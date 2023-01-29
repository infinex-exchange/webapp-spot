function gotoStep(step) {
    $('.support-step').addClass('d-none');
    $('#' + step).removeClass('d-none');
}

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    $(document).trigger('renderingStage');
    
    $('[data-goto]').click(function() {
        var for = $(this).data('for');
        if(typeof(for) !== 'undefined') {
            if(window.loggedIn && !for.includes('user')) {
                msgBox('This option cannot be used as a logged in user');
                return;
            }
            if(!window.loggedIn && !for.includes('guest')) {
                gotoLogin();
                return;
            }
        }
        
        gotoStep($(this).data('goto'));
    });
});
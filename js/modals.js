function msgBox(message) {
    $('#modal-text').html(message);
    $('.modal-close').unbind('click');
    $('#modal').modal('show');
}

function msgBoxRedirect(message, to = '/') {
    $('#modal-text').html(message);
    $('.modal-close').click(function() {
        window.location.replace(to);
    });    
    $('#modal').modal('show');
}


function msgBoxNoConn(redirect = false) {
    if(redirect) msgBoxRedirect('No connection');
    else msgBox('No connection');
}

function msgBoxUnauthorized() {
    msgBoxRedirect('You have no authorization to view this site');
}
$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    $('#reflink-description').on('input', function() {
        if(validateReflinkDescription($(this).val()))
            $('#help-reflink-description').hide();
        else
            $('#help-reflink-description').show();
    });
});

function removeReflink(refid) {
    $.ajax({
        url: config.apiUrl + '/account/reflinks/remove',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            refid: refid
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $('.reflinks-item[data-refid=' + refid + ']').remove();
        } else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });     
}

function addChangeReflink(refid, description, members) {
    var elem = $('.reflinks-item[data-refid=' + refid + ']');
    if(elem.length) {
        elem.data('description', description);
        elem.find('.reflink-description').html(description);
    }
    else $('#reflinks-data').append(`
        <div class="reflinks-item row p-2 hoverable" onClick="mobileReflinkDetails(this)"
         data-refid="${refid}" data-description="${description}" data-members-1="${members[1]}"
         data-members-2="${members[2]}" data-members-3="${members[3]}" data-members-4="${members[4]}">
            <div class="col-12 col-lg-4 my-auto wrap">
                <h5 class="secondary reflink-description d-lg-none">${description}</h5>
                <span class="reflink-description d-none d-lg-inline">${description}</span>
            </div>
            <div class="col-12 col-lg-5 my-auto">
                <div class="row">
                    <div class="col-3 text-center">
                        <div class="p-1 ui-card-light rounded">
                            <h6>Lvl 1</h6>
                            <span>${members[1]} <i class="fa-solid fa-users"></i></span>
                        </div>
                    </div>
                    <div class="col-3 text-center">
                        <div class="p-1 ui-card-light rounded">
                            <h6>Lvl 2</h6>
                            <span>${members[2]} <i class="fa-solid fa-users"></i></span>
                        </div>
                    </div>
                    <div class="col-3 text-center">
                        <div class="p-1 ui-card-light rounded">
                            <h6>Lvl 3</h6>
                            <span>${members[3]} <i class="fa-solid fa-users"></i></span>
                        </div>
                    </div>
                    <div class="col-3 text-center">
                        <div class="p-1 ui-card-light rounded">
                            <h6>Lvl 4</h6>
                            <span>${members[4]} <i class="fa-solid fa-users"></i></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3 d-none d-lg-block my-auto">
                <button type="button" class="btn btn-primary btn-sm" onClick="showEditReflinkPrompt(${refid})">Rename</a>
                <button type="button" class="btn btn-primary btn-sm" onClick="removeReflink(${refid})">Remove</a>
            </div>
        </div>
    `);      
}

function showAddReflinkPrompt() {
    $('#reflink-description-form').unbind('submit');
    $('#reflink-description-form').submit(function(event) {
        event.preventDefault();
        
        var description = $('#reflink-description').val();
        
        if(!validateReflinkDescription(description)) {
            msgBox('Please fill in the form correctly');
            return;
        }
        
        $('#modal-reflink-desc-prompt').modal('hide');
        
        $.ajax({
            url: config.apiUrl + '/account/reflinks/new',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                description: description
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                addChangeReflink(data.refid, description, {1:0, 2:0, 3:0, 4:0});
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });     
    });
    
    $('#reflink-description').val('');
    $('#help-reflink-description').hide();
    $('#modal-reflink-desc-prompt').modal('show');
}

function showEditReflinkPrompt(refid) {
    var oldDescription = $('.reflinks-item[data-refid=' + refid + ']').attr('data-description');
    
    $('#reflink-description-form').unbind('submit');
    $('#reflink-description-form').submit(function(event) {
        event.preventDefault();
        
        var description = $('#reflink-description').val();
        
        if(!validateReflinkDescription(description)) {
            msgBox('Please fill in the form correctly');
            return;
        }
        
        $('#modal-reflink-desc-prompt').modal('hide');
        
        $.ajax({
            url: config.apiUrl + '/account/reflinks/edit',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                refid: refid,
                description: description
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                addChangeReflink(refid, description, null);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });     
    });
    
    $('#reflink-description').val(oldDescription);
    $('#help-reflink-description').hide();
    $('#modal-reflink-desc-prompt').modal('show');
}

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        $.ajax({
            url: config.apiUrl + '/account/reflinks',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                $.each(data.reflinks, function(refid, v) {
                    addChangeReflink(refid, v.description, v.members); 
                });
                        
                $(document).trigger('renderingStage');
            } else {
                msgBoxRedirect(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(true);
        });     
    }
});

function mobileReflinkDetails(item) {
    if($(window).width() > 991) return;
    
    var refid = $(item).data('refid');
    
    $('#mrd-description').html($(item).data('description'));
    $('#mrd-rename-btn').unbind('click').on('click', function() {
        $('#modal-reflink-details').modal('hide');
        showEditReflinkPrompt(refid);
    });
    $('#mrd-remove-btn').unbind('click').on('click', function() {
        $('#modal-reflink-details').modal('hide');
        removeReflink(refid);
    });
    $('#mrd-api-key').html($(item).data('api-key'));
    
    $('#modal-reflink-details').modal('show');
}
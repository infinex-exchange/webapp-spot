$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    $('#api-key-description').on('input', function() {
        if(validateApiKeyDescription($(this).val()))
            $('#help-api-key-description').hide();
        else
            $('#help-api-key-description').show();
    });
});

function removeAK(sid) {
    $.ajax({
        url: config.apiUrl + '/account/api_keys/remove',
        type: 'POST',
        data: JSON.stringify({
            api_key: window.apiKey,
            sid: sid
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            $('.sessions-item[data-sid=' + sid + ']').remove();
        } else {
            msgBox(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(false);
    });     
}

function addChangeApiKey(sid, api_key, description) {
    var elem = $('.sessions-item[data-sid=' + sid + ']');
    if(elem.length) {
        elem.find('.api-key-description').html(description);
    }
    else $('#api-keys-data').append(`
        <div class="sessions-item row p-2 hoverable" onClick="mobileApiKeyDetails(this)"
         data-sid="${sid}" data-api-key="${api_key}" data-description="${description}">
            <div class="col-4 col-lg-12 wrap">
                <h5 class="secondary api-key-description d-lg-none">${description}</h5>
                <span class="api-key-description d-none d-lg-inline">${description}</span>
            </div>
            <div class="col-5 col-lg-12">
                <div class="row flex-nowrap">
                    <div class="col-10 my-auto wrap">
                        <h4 class="wrap" id="api-key-${sid}">${api_key}</h4>
                    </div>
                    <div class="col-2 my-auto">
                        <a href="#_" class="secondary copy-button" data-copy="#api-key-${sid}"><i class="fa-solid fa-copy fa-xl"></i></a>
                    </div>
                </div>
            </div>
            <div class="col-3 d-none d-lg-block">
                <button type="button" class="btn btn-primary btn-sm" onClick="showEditAKPrompt(${sid})">Rename</a>
                <button type="button" class="btn btn-primary btn-sm" onClick="removeAK(${sid})">Remove</a>
            </div>
        </div>
    `);      
}

function showAddAKPrompt() {
    $('#api-key-description-form').unbind('submit');
    $('#api-key-description-form').submit(function(event) {
        event.preventDefault();
        
        var description = $('#api-key-description').val();
        
        if(!validateApiKeyDescription(description)) {
            msgBox('Please fill in the form correctly');
            return;
        }
        
        $('#modal-ak-desc-prompt').modal('hide');
        
        $.ajax({
            url: config.apiUrl + '/account/api_keys/new',
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
                addChangeApiKey(data.sid, data.api_key, description);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });     
    });
    
    $('#api-key-description').val('');
    $('#help-api-key-description').hide();
    $('#modal-ak-desc-prompt').modal('show');
}

function showEditAKPrompt(sid) {
    var oldDescription = $('.sessions-item[data-sid=' + sid + ']').attr('data-description');
    
    $('#api-key-description-form').unbind('submit');
    $('#api-key-description-form').submit(function(event) {
        event.preventDefault();
        
        var description = $('#api-key-description').val();
        
        if(!validateApiKeyDescription(description)) {
            msgBox('Please fill in the form correctly');
            return;
        }
        
        $('#modal-ak-desc-prompt').modal('hide');
        
        $.ajax({
            url: config.apiUrl + '/account/api_keys/edit',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                sid: sid,
                description: description
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                addChangeApiKey(sid, null, description);
            } else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false);
        });     
    });
    
    $('#api-key-description').val(oldDescription);
    $('#help-api-key-description').hide();
    $('#modal-ak-desc-prompt').modal('show');
}

$(document).on('authChecked', function() {
    if(window.loggedIn) {
        $.ajax({
            url: config.apiUrl + '/account/api_keys/list',
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
                $.each(data.sessions, function(sid, v) {
                    addChangeApiKey(sid, v.api_key, v.description); 
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
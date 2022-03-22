var deviceTypeIconDict = {
    desktop: 'fa-solid fa-computer',
    mobile: 'fa-solid fa-mobile-screen',
    tv: 'fa-solid fa-tv',
    console: 'fa-regular fa-gamepad',
    mediaplayer: 'fa-solid fa-tv',
    car: 'fa-regular fa-car',
    watch: 'fa-regular fa-clock',
    unkown: 'fa-solid fa-question'
};

$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    $('#api-key-description').on('input', function() {
        if(validateApiKeyDescription($(this).val()))
            $('#help-api-key-description').hide();
        else
            $('#help-api-key-description').show();
    });
});

function killSession(sid) {
    $.ajax({
        url: config.apiUrl + '/account/session/kill',
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
        <div class="sessions-item row p-2 hoverable" data-sid="${sid}" data-description="${description}">
            <div class="col-4">
                ${api_key}
            </div>
            <div class="col-4">
                <span class="api-key-description">${description}</span>
            </div>
            <div class="col-4">
                <button type="button" class="btn btn-primary btn-sm font-1" onClick="showEditAKPrompt(${sid})">Rename</a>
                <button type="button" class="btn btn-primary btn-sm font-1" onClick="killSession(${sid})">Remove</a>
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
            url: config.apiUrl + '/account/session/new_api_key',
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
            url: config.apiUrl + '/account/session/edit',
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
            url: config.apiUrl + '/account/session/list',
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
                    if(v.origin == 'WEBAPP') {
                        var browserIcon = 'fa-solid fa-question';
                        if(v.browser.includes('Chrome'))
                            browserIcon = 'fa-brands fa-chrome';
                        else if(v.browser.includes('Firefox'))
                            browserIcon = 'fa-brands fa-firefox';
                        else if(v.browser.includes('Edge'))
                            browserIcon = 'fa-brands fa-edge';
                        else if(v.browser.includes('Safari'))
                            browserIcon = 'fa-brands fa-safari';
                        
                        var osIcon = 'fa-solid fa-question';
                        if(v.os.includes('Windows'))
                            osIcon = 'fa-brands fa-windows';
                        else if(v.os.includes('Android'))
                            osIcon = 'fa-brands fa-android';
                        else if(v.os.includes('macOS'))
                            osIcon = 'fa-brands fa-apple';
                        else if(v.os.includes('iOS'))
                            osIcon = 'fa-brands fa-apple';
                        else if(v.os.includes('Linux'))
                            osIcon = 'fa-brands fa-linux';
                        
                        var csInfo = '';
                        var csOnClick = 'killSession(' + sid + ')';
                        var csButton = 'Kill';
                        if(v.current_session) {
                            csInfo = '<br>(Current session)';
                            csOnClick = 'logOut()';
                            csButton = 'Logout';
                        }
                        
                        $('#sessions-data').append(`
                            <div class="sessions-item row p-2 hoverable" data-sid="${sid}">
                                <div class="col-2">
                                    #${sid}
                                    ${csInfo}
                                </div>
                                <div class="col-3">
                                    <i class="${deviceTypeIconDict[v.device]}"></i>
                                    ${v.device}<br>
                                    <i class="${browserIcon}"></i>
                                    ${v.browser}<br>
                                    <i class="${osIcon}"></i>
                                    ${v.os}
                                </div>
                                <div class="col-4">
                                    ${v.lastact}
                                </div>
                                <div class="col-3">
                                    <button type="button" class="btn btn-primary btn-sm font-1" onClick="${csOnClick}">${csButton}</a>
                                </div>
                            </div>
                        `);
                    }
                    
                    else
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
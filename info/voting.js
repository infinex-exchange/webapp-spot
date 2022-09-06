function renderVoting(data, canVote) {
    return `
        <div class="row p-2 hoverable">
            <div class="col-1 d-none d-lg-block">
                ${level}
            </div>
            <div class="col-1 d-lg-none my-auto text-center">
                Lvl
                <h3>${level}</h3>
            </div>
            <div class="col-11">
                <div class="row">
                    <div class="col-6 d-lg-none secondary">
                        30d trade volume:
                    </div>
                    <div class="col-6 col-lg text-end">
                        &ge; ${data.volume} ${data.volume_asset}
                    </div>
                    <div class="col-6 d-lg-none secondary">
                        Hold:
                    </div>
                    <div class="col-6 col-lg text-end">
                        &ge; ${data.hold} ${data.hold_asset}
                    </div>
                    <div class="col-6 d-lg-none secondary">
                        Maker fee:
                    </div>
                    <div class="col-6 col-lg text-end">
                        ${data.maker_fee}%
                    </div>
                    <div class="col-6 d-lg-none secondary">
                        Taker fee:
                    </div>
                    <div class="col-6 col-lg text-end">
                        ${data.taker_fee}%
                    </div>
                </div>
            </div>
        </div>
    `;
}

$(document).ready(function() {
    window.renderingStagesTarget = 2;
    
    $('.submit-project').click(function() {
        $.ajax({
            url: config.apiUrl + '/info/voting/submit/check',
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
                $('#msp-symbol, #msp-name, #msp-website').val('');
                $('#modal-submit-project').modal('show');
            }
            else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false); 
        });
    });
    
    $('#msp-submit').click(function() {
        var symbol = $('#msp-symbol').val();
        var name = $('#msp-name').val();
        var website = $('#msp-website').val();
        
        if(!validateAssetSymbol(symbol) ||
           !validateVotingName(name) ||
           !validateVotingWebsite(website)
        ) {
            msgBox('Fill the form correctly');
            return;
        }
        
        $.ajax({
            url: config.apiUrl + '/info/voting/submit',
            type: 'POST',
            data: JSON.stringify({
                api_key: window.apiKey,
                project_symbol: symbol,
                project_name: name,
                project_website: website
            }),
            contentType: "application/json",
            dataType: "json",
        })
        .retry(config.retry)
        .done(function (data) {
            if(data.success) {
                msgBox('The proposal has been sent and will appear in the next vote after being verified.');
            }
            else {
                msgBox(data.error);
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            msgBoxNoConn(false); 
        });
    });
    
	$('#msp-symbol').on('input', function() {
        if(validateAssetSymbol($(this).val()))
            $('#msp-help-symbol').hide();
        else
            $('#msp-help-symbol').show();
    });
    
    $('#msp-name').on('input', function() {
        if(validateVotingName($(this).val()))
            $('#msp-help-name').hide();
        else
            $('#msp-help-name').show();
    });
    
    $('#msp-website').on('input', function() {
        if(validateVotingWebsite($(this).val()))
            $('#msp-help-website').hide();
        else
            $('#msp-help-website').show();
    });
    
    $.ajax({
        url: config.apiUrl + '/info/voting/current',
        type: 'POST',
        data: JSON.stringify({
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            if(data.voting_open)
                $('#current-voting-data').html(renderVoting(data.projects, true));
            
            else
                $('#no-voting').removeClass('d-none');
            
            $(document).trigger('renderingStage'); 
        }
        else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true); 
    });
    
    window.votingHistoryAS = new AjaxScroll(
        $('#previous-votings-data'),
        $('#previous-votings-data-preloader'),
        {},
        function() {
            this.data.offset = this.offset;
            var thisAS = this;
    
            $.ajax({
                url: config.apiUrl + '/info/voting/history',
                type: 'POST',
                data: JSON.stringify(thisAS.data),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(data.success) {
                    $.each(data.votings, function(k, voting) {
                        thisAS.append(voting.projects);
                    });
                    
                    thisAS.done();
                    
                    if(thisAS.offset == 0)
                        $(document).trigger('renderingStage');
                       
                    if(data.votings.length != 50)
                        thisAS.noMoreData(); 
                }
                else {
                    msgBoxRedirect(data.error);
                    thisAS.done();
                    thisAS.noMoreData();
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                msgBoxNoConn(true);
                thisAS.done();
                thisAS.noMoreData(); 
            });
        },
        true,
        true
    );        
});
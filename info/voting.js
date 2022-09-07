function renderVoting(data, canVote) {
    var header = '';
    
    if(typeof(data.votingid) !== 'undefined' && typeof(data.month) !== 'undefined')
        header = `
            <div class="col-12">
                <h4>Voting #${data.votingid} - ${data.month}</h4>
            </div>
        `;
    
    var projects = '';
    
    $.each(data.projects, function(k, proj) {
        projects += `
            <div class="col-10">
                <div class="row">
                    <div class="col-12">
                        ${proj.symbol} ${proj.name} ${proj.website}
                    </div>
                    <div class="col-12">
                        chart
                    </div>
                </div>
            </div>
            <div class="col-2">
            </div>
        `;
    });
    
    return `
        <div class="row p-2 hoverable">
            ${header}
            ${projects}
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
                $('.msp-help').hide();
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
                $('#modal-submit-project').modal('hide');
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
                $('#current-voting-data').html(renderVoting(data, true));
            
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
                        
                    if(thisAS.offset == 0 && data.votings.length == 0)
                        $('#no-history').removeClass('d-none');
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
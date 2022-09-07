function renderVoting(data, canVote) {
    var header = '';
    
    if(typeof(data.votingid) !== 'undefined' && typeof(data.month) !== 'undefined')
        header = `
            <div class="col-12">
                <h4>Voting #${data.votingid} - ${data.month}</h4>
            </div>
        `;
    
    var projects = '';
    var projHover = '';
    if(canVote) projHover = 'hoverable';
    
    var maxVotes = null;
    
    $.each(data.projects, function(k, proj) {
        if(maxVotes == null) {
            maxVotes = proj.votes;
        }
        
        var progressVal = floor(proj.votes / maxVotes * 100); 
    
        var voteButton = '';
    
        if(window.loggedIn) {
            voteButton = `
                <a href="#_" class="btn btn-sm btn-primary" onClick="vote(${proj.projectid})">
                    Vote
                </a>
            `;
        }
        
        else {
            voteButton = `
                <div class="small border border-primary rounded p-2 text-center">
                    <a class="link-ultra" href="#_" onClick="gotoLogin()">Log In</a> or <a class="link-ultra" href="/account/register">Register</a> to vote
                </div>
            `;
        }
        
        projects += `
            <div class="col-12 ${projHover} py-2">
                <div class="row">
                    <div class="col-9 col-lg-11 my-auto">
                    <div class="row">
                        <div class="col-12 pb-1">
                            <strong>${proj.symbol}</strong>
                            <span class="secondary">${proj.name}</span>
                            <span class="small">
                                (
                                <a href="${proj.website}" target="_blank">${proj.website}</a>
                                )
                            </span>
                        </div>
                        <div class="col-12">
                            <div class="progress">   
                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${progressVal}%; background-color: ${proj.color};">
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="col-3 col-lg-1 my-auto">
                        ${voteButton}
                    </div>
                </div>
            </div>
        `;
    });
    
    var mainHover = 'hoverable';
    if(canVote) mainHover = '';
    
    return `
        <div class="row p-2 ${mainHover}">
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
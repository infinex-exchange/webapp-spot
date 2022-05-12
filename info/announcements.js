$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    window.annoAS = new AjaxScroll(
        $('#announcements-data'),
        $('#announcements-data-preloader'),
        {},
            function() {
                
                //---
                this.data.offset = this.offset;
                var thisAS = this;
                
                $.ajax({
                    url: config.apiUrl + '/info/announcements',
                    type: 'POST',
                    data: JSON.stringify(thisAS.data),
                    contentType: "application/json",
                    dataType: "json",
                })
                .retry(config.retry)
                .done(function (data) {
                    if(data.success) {
                        $.each(data.announcements, function(k, v) {
                            var markdown = marked.parse(v.body);
                            var time = new Date(v.time * 1000).toLocaleString();
                            thisAS.append(`
                                <div class="row mt-0 mb-4 p-2 ui-card-light">
                                    <h3 class="pt-3">${v.title}</h3>
                                    <h6 class="pb-2">${time}</h6>
                                    <div class="secondary">` + markdown + `</div>
                                </div>
                            `);
                        });
                        
                        thisAS.done();
                
                        if(thisAS.offset == 0)
                            $(document).trigger('renderingStage');
                            
                        if(data.announcements.length != 50)
                            thisAS.noMoreData();
                    } else {
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
                //---
                
            }
        );
});
$(document).ready(function() {
    $('#select-coin').on('click', function() {
        $('#select-coin-dropdown').toggle();
        $('#select-coin-arrow').toggleClass('flip');
    });
    
    $('#select-coin-search').on('input', function() {
        var query = $(this).val();
        if(query == '')
            delete window.selectCoinAS.data.search;
        else
            window.selectCoinAS.data.search = query;
        window.selectCoinAS.reset();
    });

    window.selectCoinAS = new AjaxScroll(
        $('#select-coin-data'),
        $('#select-coin-data-preloader'),
        {},
        function() {
            this.data.offset = this.offset;
            var thisAS = this;
                
            $.ajax({
                url: config.apiUrl + '/wallet/assets',
                type: 'POST',
                data: JSON.stringify(thisAS.data),
                contentType: "application/json",
                dataType: "json",
            })
            .retry(config.retry)
            .done(function (data) {
                if(data.success) {
                    $.each(data.assets, function(k, v) {
                        thisAS.append(`
                            <div class="select-coin-item row p-1 hoverable" data-asset="${k}">
                                <div class="col-auto my-auto text-center" style="width: 32px">
                                    <img width="24px" height="24px" src="${v.icon_url}">
                                </div>
                                <div class="col my-auto">
                                    <strong class="text-hi">${k}</strong>
                                    ${v.name}
                                </div>
                            </div>
                        `);
                    });
                    
                    $('.select-coin-item').on('click', function() {
                        $('#select-coin').val($(this).attr('data-asset'));
                        $('#select-coin').trigger('change');
                        $('#select-coin-dropdown').toggle();
                        $('#select-coin-arrow').toggleClass('flip');
                    });
                        
                    thisAS.done();
                            
                    if(data.assets.length != 25)
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
        }
    );
});
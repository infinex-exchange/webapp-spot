$(document).ready(function() {
    window.renderingStagesTarget = 1;
    
    var pathArray = window.location.pathname.split('/');
    var pathAnno = pathArray[pathArray.length - 1];
    
    const renderer = {
        heading(text, level) {
            return '<h3>' + text + '</h3>';
        },
        image(href) {
            return `
                <div class="row">
                    <div class="col-8 mx-auto">
                        <img src="${href}" class="img-fluid">
                    </div>
                </div>
            `;
        }
    };
    
    marked.use({ renderer });
    
    $.ajax({
        url: config.apiUrl + '/info/announcement',
        type: 'POST',
        data: JSON.stringify({
            id: pathAnno
        }),
        contentType: "application/json",
        dataType: "json",
    })
    .retry(config.retry)
    .done(function (data) {
        if(data.success) {
            var markdown = marked.parse(data.body);
            var time = new Date(data.time * 1000).toLocaleString();
            
            document.title = data.title + ' | Vayamos Spot';
            
            $('#anno-title').html(data.title);
            $('#anno-time').html(time);
            $('#anno-body').html(markdown);
            
            $(document).trigger('renderingStage');
        } else {
            msgBoxRedirect(data.error);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        msgBoxNoConn(true);
    });
});
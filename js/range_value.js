$( document ).ready(function() {
    $('.range-value').each(function() {
        var valItem = $(this);
        $('#' + $(this).attr('for')).on('input', function() {
            valItem.html($(this).val() + valItem.attr('suffix'));
            var left = $(this).val() / $(this).attr('max') * $(this).width() - (valItem.width() / 2);
            if(left < 0) left = 0;
            if(left > $(this).width() - valItem.width()) left = $(this).width() - valItem.width();
            valItem.css('left', left);
        }).trigger('input');
    });
});
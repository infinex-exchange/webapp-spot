class AjaxScroll {
    constructor(container, preloader, data, callback) {
        this.container = container;
        this.preloader = preloader;
        this.data = data;
        this.callback = callback;
        
        var thisAS = this;
        $(container).on('scroll', function() {
            if(Math.round($(this).scrollTop() + $(this).innerHeight(), 10) >= Math.round($(this)[0].scrollHeight, 10) &&
               !thisAS.working &&
               !thisAS.noMore
            ) {
                thisAS.work();
            }
        });
        
        this.reset();
    }
    
    work() {
        this.working = true;
        $(this.preloader).show();
        this.offset = $(this.container).children().length;
        this.callback();
    }
    
    done() {
        this.working = false;
        $(this.preloader).hide();
    }
    
    noMoreData() {
        this.noMore = true;
    }
    
    reset() {
        this.noMore = false;
        $(this.container).empty();
        
        this.work();
    }
    
    append(elem) {
        $(this.container).append(elem);
    }
}
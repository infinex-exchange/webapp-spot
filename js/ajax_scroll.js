class AjaxScroll {
    constructor(container, preloader, data, callback, runNow = true) {
        this.container = container;
        this.preloader = preloader;
        this.data = data;
        this.callback = callback;
        this.working = false;
        this.noMore = false;
        this.resetTimeout = null;
        
        var thisAS = this;
        $(container).on('scroll', function() {
            if(Math.round($(this).scrollTop() + $(this).innerHeight(), 10) >= Math.round($(this)[0].scrollHeight, 10) &&
               !thisAS.working &&
               !thisAS.noMore
            ) {
                thisAS.work();
            }
        });
        
        if(runNow) this.reset();
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
        if(this.working) {
            clearTimeout(this.resetTimeout);
            var thisAS = this;
            this.resetTimeout = setTimeout(function() { thisAS.reset() }, 100);
        }
        else {
            this.noMore = false;
            $(this.container).empty();
        
            this.work();
        }
    }
    
    append(elem) {
        $(this.container).append(elem);
    }
    
    prepend(elem) {
        $(this.container).prepend(elem);
    }
}
/*
    Switchboard.js
    - A javascript to enable easy registration and triggering of breakpoints
    - Author: Jesse Weisbeck @jlweisbeck w/ inspiration taken from http://adactio.com/journal/5429/
*/

;(function(win, undefined) {
    var doc = win.document;

    Switchboard = {
        init: function(){
            // TODO - add object.create shim for old browsers
            return Object.create(this);
        },
        setup: function(opts){

            // opts should be a object of callbacks to run
            // names should match the switch names in the DOM el with data-switches attr
            if( !opts.settings || !opts.callbacks ) {
                console.log('Please pass the config pojso');
                return false;
            }

            this.settings = opts.settings;
            this.callbacks = opts.callbacks;
            this.breakpoints = {};
            this.cache = "";
            this.breakpoint = "";

            if( this.settings.el ){
                this.el = this.settings.el;
            }
            return this; // return so run() can be executed asynchronously by user
        },
        run: function(onload){
            var self = this;
            
            // get switches
            var switchEl = doc.getElementById(self.el.substring(1));

            self.breakpoint = self._getContentVal(switchEl);

            $(window).resize(function(){
                // content string matches the id of the breakpoint method
                // content property won't work works in < IE8
                self.breakpoint = self._getContentVal(switchEl);
                if( self.breakpoint !== '') self._runCallback();
            });

            // do an initial run if onload is true
            if( onload ){                    
                self._runCallback();
            }


        },
        _getContentVal: function(el){
            
            if (win.getComputedStyle) {
                return getComputedStyle(el, null).getPropertyValue("content").replace(/"/g, '');
            } else {
              return el.currentStyle.content;
            }
        },
        _runCallback: function(){

            if( this.breakpoint === this.cache || !this.breakpoint )  return;

            // call the user-supplied callback that matches current breakpoint
            if( this.cache && typeof this.callbacks[this.cache] === 'object' ) {
                this.callbacks[this.cache].exit.call(this);
            }


            if( this.breakpoint && typeof this.callbacks[this.breakpoint] === 'object' ) {
                this.callbacks[this.breakpoint].enter.call(this);
            } else {
                this.callbacks[this.breakpoint].call(this);
            }

            this.cache = this.breakpoint;
        }
    }


})(this);
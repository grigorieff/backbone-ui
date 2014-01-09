// A mixin for dealing with errors in widgets 
(function(){

  Backbone.UI.HasError = {

    options : {
      // Can be inserted into the flow of the form as the type 'inform' or as
      // a flyover disclosing the error message as the type 'disclosure'
      errorType : 'inform',
      // Where the error message will be displayed.
      // Possible positions: 'right', 'below'
      errorPosition : 'below',
      // ignore validation - used by pulldown, datepicker, and timepicker
      // so that embedded Backbone.UI elements don't double errors notifications
      ignoreErrors : false
    },
    
    _observeErrors : function() {
      
      if(this.model) {
        this.listenTo(this.model, 'invalid', function(exceptions) {
          // find an exception thrown for the model.attribute
          // that this Backbone.UI element observes
          var errors = _(exceptions).find(function(val, key) {
            return this.options.content === key;
          }, this);
        
          if(errors) {
            var errorMessage = _(errors).reduce(function(message, error){
              return message + ' ' + error;
            });            
            this.setError(errorMessage);
          } 
        });
      }  
    },
    
    unsetError : function() {
      // remove error class
      this.$el.removeClass('error');
      // remove error message if it exists
      _(this.errorMessage).removeEl();
      // remove disclosure if it exists
      _(this._disclosure).removeEl();
      // remove event attached to the model regarding errors   
      if(_(this._unobserveModel).exists()) {
        this._unobserveModel(_(this.unsetError).bind(this));
      }
    },
    
    setError : function(message) {
      
      // add event to model to unset error when on change
      if(_(this._observeModel).exists()) {
        this._observeModel(_(this.unsetError).bind(this));
      }
       
      // message will default to empty string
      message = (message === null || _(message).isUndefined()) ? "" : message;
      // clear existing error
      this.unsetError();
      // add error class
      this.$el.addClass('error');
      
      // add error message if provided
      if(message.length > 0) {
        
        if(this.options.errorType !== "disclosure") {
          this.errorMessage = $.el.span({className : 'error_message ' + 
            this.options.errorPosition}, message);
        }
        else {
          this.errorMessage = $.el.span({className : 'error_message right with_disclosure'}, "!");
          
          this._disclosure = $.el.div({className : 'disclosure'},
            this._disclosureOuter = $.el.div({className: 'disclosure_outer'},
              this._disclosureInner = $.el.div({className: 'disclosure_inner'}, message),
                this._disclosureArrow = $.el.div({className: 'disclosure_arrow'})));
          
          bean.on(this.errorMessage, 'click', _(function(e) {
            e.stop();
            this._showDisclosure();
          }).bind(this));
          
          bean.on(this.el, 'click', _(function() {
            _(this._disclosure).removeEl();
          }).bind(this));
          
        }
        
        this.el.childNodes[0].appendChild(this.errorMessage);
        
        if(this._disclosure) {
          this._showDisclosure();
        }
        
      }
      
    },
    
    _showDisclosure : function(){
      // add the disclosure
      this.el.appendChild(this._disclosure);
      // set the position
      if(this.options.errorPosition === 'right') {
        Backbone.UI.Util(this._disclosure).alignTo(this.errorMessage, 'right', 10, 0, this.el);
      }
      else {
        Backbone.UI.Util(this._disclosure).alignTo(this.errorMessage, 'center bottom', 0, 10, this.el);
      }
         
      // add the appropriate class to disclosure arrow for correct sprite and styles
      _(this._disclosureOuter).addClass(this.options.errorPosition === 'right' ? 'arrow_left' : 'arrow_up');
      // set the disclosure arrow position
      var pos = this.options.errorPosition === 'right' ? ((this._disclosure.clientHeight / 2) - 10) : 
        ((this._disclosure.clientWidth / 2) - 10);
      var cssTopOrLeft = this.options.errorPosition === 'right' ? 'top' : 'left';  
      this._disclosureArrow.style[cssTopOrLeft] = pos + 'px';
    }
    
  };
}());

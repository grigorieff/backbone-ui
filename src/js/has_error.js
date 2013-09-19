// A mixin for dealing with errors in widgets 
(function(){

  Backbone.UI.HasError = {

    options : {
      // Can be inserted into the flow of the form as the type 'inform' or as
      // a flyover disclosing the error message as the type 'disclosure'
      errorType : 'inform',
      // Where the error message will be displayed.
      // Possible positions: 'right', 'below'
      errorPosition : 'below'
    },
    
    unsetError : function() {
      // remove error class
      $(this.el).removeClass('error');
      // remove error message if it exists
      $(this.errorMessage).remove();   
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
      $(this.el).addClass('error');
      
      // add error message if provided
      if(message !== "") {
        
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
          
          $(this.errorMessage).click(_(function(e) {
            e.preventDefault();
            this._showDisclosure();
            return false;
          }).bind(this));
          
          $(this.el).click(_(function() {
            $(this._disclosure).remove();
          }).bind(this));
          
        }
        
        this.el.childNodes[0].appendChild(this.errorMessage);
        
        if(this._disclosure) {
          this._showDisclosure();
        }
        
      }
      
    },
    
    _showDisclosure : function(){
      document.body.appendChild(this._disclosure);
      var showOnTop = $(window).height() - ($(this.errorMessage).offset().top - document.body.scrollTop) < 150;
      var position = (this.options.alignment === 'left' ? '-left' : this.options.alignment === 'right' ? '-right' : 'center') + (showOnTop ? 'top' : ' bottom');
      $(this._disclosure).alignTo(this.errorMessage, position, 0, 0);    
    
      //calculate position of arrow based on tooltip alignment
      var xpos = (($(this._disclosure).width() / 2) - 10);
        //this.options.alignment === 'left' ? (($(this.errorMessage).width() / 2) - 10) : ($(this._disclosure).width() - (($(this.errorMessage).width() / 2) + 10));
      
      $(this._disclosureOuter).toggleClass('arrow_down', showOnTop);
      $(this._disclosureArrow).css('left', xpos + 'px');
      $(this._disclosureArrow).css((!showOnTop ? 'top' : ' bottom'), '0px');
          
    }
    
  };
}());

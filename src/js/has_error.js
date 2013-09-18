// A mixin for dealing with errors in widgets 
(function(){

  Backbone.UI.HasError = {

    options : {
      // How the error message will be displayed
      errorPosition : 'below'
    },
    
    setError : function(isError, message) {
      
      // isError will default to true
      isError = (isError === null || _(isError).isUndefined()) ? true : isError;
      // message will default to empty string
      message = (message === null || _(message).isUndefined()) ? "" : message;
      // toggle error class
      $(this.el).toggleClass('error', isError);
      
      // remove error message if it exists
      $(this.errorMessage).remove();
      
      // add error message if provided
      if(isError && (message !== "")) {
        
        if(this.options.errorPosition !== "disclosure") {
          this.errorMessage = $.el.span({className : 'error_message ' + 
            this.options.errorPosition}, message);
        }
        else {
          this.errorMessage = $.el.span({className : 'error_message right with_disclosure'}, "!");
          
          this._disclosure = $.el.div({className : 'disclosure'},
            this._disclosureOuter = $.el.div({className: 'disclosure_outer'},
              this._disclosureInner = $.el.div({className: 'disclosure_inner'}, message),
                this._disclosureArrow = $.el.div({className: 'disclosure_arrow'})));
          
          $(this.errorMessage).click(_(this._showDisclosure).bind(this));
          
        }
        
        this.el.childNodes[0].appendChild(this.errorMessage);
      }
      
    },
    
    _getDisclosure : function(message) {
      
      this.errorDisclosure = $.el.div({className : 'disclosure'}, 
        $.el.span({className : 'disclosure_message'}, message));
      
      this.el.appendChild(this.errorDisclosure);
      
      $(this.el).mouseover(_(function() {
        $(this.errorDisclosure).show();
        }).bind(this));
      
      $(this.input).focus(_(function() {
        $(this.errorDisclosure).hide();
      }).bind(this));
      
      return $.el.span({className : 'error_message right'}, "!");
        
    },
    
    _showDisclosure : function(){
      document.body.appendChild(this._disclosure);
      var showOnTop = $(window).height() - ($(this.errorMessage).offset().top - document.body.scrollTop) < 150;
      var position = (this.options.alignment === 'left' ? '-left' : this.options.alignment === 'right' ? '-right' : 'center') + (showOnTop ? 'top' : ' bottom');
      $(this._disclosure).alignTo(this.errorMessage, position, 0, 0);
      $(this._disclosure).autohide({
        onEvent : 'mouseover',
        leaveOpenTargets : $(this._disclosure),
        hideCallback : _(function(){
          $(this._disclosure).remove();
        }).bind(this)
      });      
    
      //calculate position of arrow based on tooltip alignment
      var xpos = (($(this._disclosure).width() / 2) - 10);
        //this.options.alignment === 'left' ? (($(this.errorMessage).width() / 2) - 10) : ($(this._disclosure).width() - (($(this.errorMessage).width() / 2) + 10));
      
      $(this._disclosureOuter).toggleClass('arrow_down', showOnTop);
      $(this._disclosureArrow).css('left', xpos + 'px');
      $(this._disclosureArrow).css((!showOnTop ? 'top' : ' bottom'), '0px');
          
    }
    
  };
}());

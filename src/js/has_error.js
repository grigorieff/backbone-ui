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
        this.errorMessage = $.el.span({className : 'error_message'}, message);
        this.el.childNodes[0].appendChild(this.errorMessage);
      }
      
    }
    
  };
}());

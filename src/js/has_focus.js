// A mixin for dealing with focus in / focus out
(function(){

  Backbone.UI.HasFocus = {
    
    setupFocus : function(el, parent) {
    
      // add focusin and focusout
      bean.on(el, {
        focusin : _(function(e) {
          $(parent).addClass('focused');
        }).bind(this),
        focusout : _(function(e) {
          $(parent).removeClass('focused');
        }).bind(this)
      });
      
    }
        
  };
}());

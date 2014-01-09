// A mixin for dealing with focus in / focus out
(function(){

  Backbone.UI.HasFocus = {
    
    setupFocus : function(el, parent) {
    
      // add focusin and focusout
      bean.on(el, {
        focusin : _(function(e) {
          Backbone.UI.Util(parent).addClass('focused');
        }).bind(this),
        focusout : _(function(e) {
          Backbone.UI.Util(parent).removeClass('focused');
        }).bind(this)
      });
      
    }
        
  };
}());

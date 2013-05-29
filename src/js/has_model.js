 // A mixin for those views that are model bound
(function(){
  Backbone.UI.HasModel = {
    
    options : {
      // The Backbone.Model instance the view is bound to
      model : null,

      // The property of the bound model this component should render / update.
      // If a function is given, it will be invoked with the model and will 
      // expect an element to be returned.  If no model is present, this 
      // property may be a string or function describing the content to be rendered
      content : null,

      // If present, a square glyph area will be added to the left side of this 
      // component, and the given string will be used as the full CSS background
      // property of that glyph area. This option is a no-op when applied 
      // to a Calender component.  When working with Checkbox components, 
      // only the glyphRightCss property will be honored.
      glyphCss : null,

      // Same as above, but on the right side.
      glpyhRightCss : null
    },

    _observeModel : function(callback) {
      if(_(this.model).exists() && _(this.model.unbind).isFunction()) {
        _(['content', 'labelContent']).each(function(prop) {
          var key = this.options[prop];
          if(_(key).exists()) {
            key = 'change:' + key;
            this.model.unbind(key, callback);
            this.model.bind(key, callback);
          }
        }, this);
      }
    }
  };
}());


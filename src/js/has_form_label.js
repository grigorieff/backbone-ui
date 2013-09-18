// A mixin for dealing with glyphs in widgets 
(function(){

  Backbone.UI.HasFormLabel = {
    
    wrapWithFormLabel : function(content) {
      var wrapped = $.el.label();
      var formLabelText = this.resolveFormLabel(this.model, this.options.formLabelContent) || this.options.formLabelContent;
      if(formLabelText) {
        wrapped.appendChild($.el.span(formLabelText));
      }
      wrapped.appendChild(content);
      return wrapped;  
    },
    
    // resolves the appropriate content from the given choices
    resolveFormLabel : function(model, content) {
      model = _(model).exists() ? model : this.model;
      content = _(content).exists() ? content : this.options.formLabelContent;
      var hasModelProperty = _(model).exists() && _(content).exists();
      return _(content).isFunction() ? content(model) : 
        hasModelProperty && _(model[content]).isFunction() ? model[content]() : 
        hasModelProperty && _(_(model).resolveProperty(content)).isFunction() ? _(model).resolveProperty(content)(model) : 
        hasModelProperty ? _(model).resolveProperty(content) : content;
    }
    
  };
}());

(function(){
  window.Backbone.UI.Checkbox = Backbone.View.extend({

    options : {
    
      // The property of the model describing the label that 
      // should be placed next to the checkbox
      labelContent : null,

      // enables / disables the checkbox
      disabled : false
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);
      _(this).bindAll('render');
      $(this.el).addClass('checkbox');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
      this.input = $.el.input();
      $(this.input).change(_(this._updateModel).bind(this));
      this._observeModel(_(this._refreshCheck).bind(this));
    },

    render : function() {

      $(this.el).empty();
      
      var value = (this.input && this.input.value.length) > 0 ? 
        this.input.value : this.resolveContent();

      $(this.el).empty();

      $(this.input).attr({
        type : 'checkbox',
        name : this.options.name,
        id : this.options.name,
        tabIndex : this.options.tabIndex,
        value : true,
        checked : value,
        disabled : this.options.disabled
      });
      
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      this.el.appendChild($.el.label(this.input, labelText));

      return this;
    },
    
    _refreshCheck : function() {
      
      var value = this.resolveContent();
      
      $(this.input).attr({ checked : value });
      
    },
    
    _updateModel : function() {
      _(this.model).setProperty(this.options.content, this.input.checked);
    }
    
  });
}());

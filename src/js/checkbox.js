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
      _(this).bindAll('_refreshCheck');
      $(this.el).addClass('checkbox');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
      this.label = $.el.label();
      this.input = $.el.input();
      $(this.input).change(_(this._updateModel).bind(this));
      $(this.label).click(_(this._updateModel).bind(this));
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
        'class' : 'checked',
        disabled : this.options.disabled
      });
      
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      
      this.label.appendChild(this.input);
      this.label.appendChild($.el.i());
      this.label.appendChild(
        this._labelText = $.el.span(labelText));
      this.el.appendChild(this.label);

      return this;
    },
    
    _refreshCheck : function() {
      
      var value = this.resolveContent();
      
      $(this.input).attr({ checked : value });
      
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      $(this._labelText).text(labelText);
      
    },
    
    _updateModel : function() {
      $(this.input).toggleClass('checked');
      _(this.model).setProperty(this.options.content, $(this.input).hasClass('checked'));
    }
    
  });
}());

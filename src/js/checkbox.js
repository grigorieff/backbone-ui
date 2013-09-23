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
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasGlyph,
        Backbone.UI.HasError]);
      _(this).bindAll('_refreshCheck');
      $(this.el).addClass('checkbox');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
      this.label = $.el.label();
      this.input = $.el.input();
      $(this.input).change(_(this._updateModel).bind(this));
      $(this.input).click(_(this._updateModel).bind(this));
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
      
      this.label.appendChild(this.input);
      this._labelText = $.el.span(labelText);
      
      var parent = $.el.div({className : 'checkbox_wrapper'});
      var content = this._labelText;
      var glyphCss = this.resolveGlyph(this.model, this.options.glyphCss);
      var glyphRightCss = this.resolveGlyph(this.model, this.options.glyphRightCss);
      this.insertGlyphLayout(glyphCss, glyphRightCss, content, parent);
      
      this.label.appendChild(parent);
      this.el.appendChild(this.label);

      this.setEnabled(!this.options.disabled);

      return this;
    },
    
    _refreshCheck : function() {
      
      var value = this.resolveContent();
      
      $(this.input).attr({ checked : value });
      
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      $(this._labelText).text(labelText);
      
    },
    
    _updateModel : function() {
      _(this.model).setProperty(this.options.content, this.input.checked);
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      if(enabled) { 
        $(this.el).removeClass('disabled');
      } else {
        $(this.el).addClass('disabled');
      }
      this.input.disabled = !enabled;
    }
    
  });
}());

(function(){
  window.Backbone.UI.Checkbox = Backbone.UI.BaseView.extend({

    options : {
    
      // The property of the model describing the label that 
      // should be placed next to the checkbox
      labelContent : null,

      // enables / disables the checkbox
      disabled : false
    },

    initialize : function(options) {
      Backbone.UI.BaseView.prototype.initialize.call(this, options);
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasGlyph,
        Backbone.UI.HasError]);
      _(this).bindAll('_refreshCheck');
      this.$el.addClass('checkbox');
      if(this.options.name){
        this.$el.addClass(this.options.name);
      }
      this.label = $.el.label();
      this.input = $.el.input({type : 'checkbox'});
      bean.on(this.input, 'change click', _(this._updateModel).bind(this));
      // listen for model changes
      this._observeModel(_(this._refreshCheck).bind(this));
      if(!this.options.ignoreErrors) {
        this._observeErrors();
      }
    },

    render : function() {

      this.$el.empty();
      Backbone.UI.Util(this.label).empty();
      
      bean.off(this.input, 'change click');
      
      var value = this.resolveContent() !== null ? 
        this.resolveContent() : this.input.checked;

      this.input.name = this.options.name;
      this.input.id = this.options.name;
      this.input.tabIndex = this.options.tabIndex;
      this.input.checked = value;
      this.input.disabled = this.options.disabled;
      
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      
      this.label.appendChild(this.input);
      this._labelText = $.el.span(labelText);
      
      var parent = $.el.div({className : 'checkbox_wrapper'});
      var content = this._labelText;
      var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
      var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
      this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, parent);
      
      this.label.appendChild(parent);
      this.el.appendChild(this.label);

      this.setEnabled(!this.options.disabled);
      
      bean.on(this.input, 'change click', _(this._updateModel).bind(this));

      return this;
    },
    
    _refreshCheck : function() {
      var value = this.resolveContent();
      this.input.checked = value;
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      this._labelText.textContent = labelText;
    },
    
    _updateModel : function() {
      _(this.model).setProperty(this.options.content, this.input.checked);
    },

    // sets the enabled state
    setEnabled : function(enabled) {
      if(enabled) { 
        this.$el.removeClass('disabled');
      } else {
        this.$el.addClass('disabled');
      }
      this.input.disabled = !enabled;
    }
    
  });
}());

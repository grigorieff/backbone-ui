(function(){
  window.Backbone.UI.Pulldown = Backbone.View.extend({
    options : {
      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',

      // A callback to invoke with a particular item when that item is
      // selected from the pulldown menu.
      onChange : Backbone.UI.noop
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, 
        Backbone.UI.HasAlternativeProperty, Backbone.UI.HasGlyph, Backbone.UI.HasFormLabel]);
      _(this).bindAll('render');

      $(this.el).addClass('pulldown');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
      
    },

    render : function() {
      $(this.el).empty();
      
      this._menu = new Backbone.UI.Menu({
        model : this.model,
        content : this.options.content,
        alternatives : this.options.alternatives,
        altLabelContent : this.options.altLabelContent,
        altValueContent : this.options.altValueContent,
        onChange : this.options.onChange,
        placeholder : this.options.placeholder,
        emptyItem : this.options.emptyItem,
        size : 1
      }).render();
      
      this._parent = $.el.div({className : 'pulldown_wrapper'});
      var glyphCss = this.resolveGlyph(this.model, this.options.glyphCss);
      var glyphRightCss = this.resolveGlyph(this.model, this.options.glyphRightCss);
      this.insertGlyphLayout(glyphCss, glyphRightCss, this._menu.el, this._parent);

      // add focusin 
      $(this._menu.el).focusin(_(function(e) {
        $(this._parent).addClass('focused');
      }).bind(this));
      
      // add focusout
      $(this._menu.el).focusout(_(function(e) {
        $(this._parent).removeClass('focused');
      }).bind(this));
      
      
      this.el.appendChild(this.wrapWithFormLabel($.el.label(this._parent)));
      
      return this;
    },

    setEnabled : function(enabled) {
      if(this.button) this.button.setEnabled(enabled);
    }
        
  });
}());

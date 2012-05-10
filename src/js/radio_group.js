(function(){
  window.Backbone.UI.RadioGroup = Backbone.View.extend({

    options : {
      // A callback to invoke with the selected item whenever the selection changes
      onChange : Backbone.UI.noop
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasGlyph, Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);
      _(this).bindAll('render');
      
      $(this.el).addClass('radio_group');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
    },

    // public accessors
    selectedItem : null,

    render : function() {

      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem() || this.selectedItem;

      var ul = $.el.ul();
      var selectedValue = this._valueForItem(this.selectedItem);
      _(this._collectionArray()).each(function(item) {

        var selected = selectedValue === this._valueForItem(item);

        var label = this.resolveContent(item, this.options.altLabelContent);
        $('a',label).click(function(e){
          e.stopPropagation(); 
        });
        
        // get glyph strings
        var glyphLeft = this.resolveContent(item, this.options.altGlyph);
        var glyphRight = this.resolveContent(item, this.options.altGlyphRight);
        
        var li = $.el.li(
          $.el.a({className : 'choice' + (selected ? ' selected' : '')},
            $.el.div({className : 'mark' + (selected ? ' selected' : '')}, 
              selected ? '\u25cf' : '\u00a0')));      
        
        // insert glyphs and label into li then add to ul
        var contentEl = this.insertGlyphLayout(glyphLeft,glyphRight,li);
        $.el.div({className : 'label'}, label).appendTo(contentEl);
        ul.appendChild(li);

        $(li).bind('click', _.bind(this._onChange, this, item));
        
      }, this);
      this.el.appendChild(ul);

      return this;
    },

    _onChange : function(item) {
      this._setSelectedItem(item);
      this.render();

      if(_(this.options.onChange).isFunction()) this.options.onChange(item);
      return false;
    }
  });
}());

(function(){
  window.Backbone.UI.Menu = Backbone.View.extend({

    options : {
      // an additional item to render at the top of the menu to 
      // denote the lack of a selection
      emptyItem : null
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);

      _(this).bindAll('render');

      $(this.el).addClass('menu');

      this._textField = new Backbone.UI.TextField().render();
    },

    scroller : null,

    render : function() {
      $(this.el).empty();

      this._observeModel(this.render);
      this._observeCollection(this.render);

      if(!Backbone.UI.IS_MOBILE){
        // create a new list of items
        var list = $.el.ul();

        // add entry for the empty model if it exists
        if(!!this.options.emptyItem) {
          this._addItemToMenu(list, this.options.emptyItem);
        }

        var selectedItem = this._determineSelectedItem();

        _(this._collectionArray()).each(function(item) {
          var selectedValue = this._valueForItem(selectedItem);
          var itemValue = this._valueForItem(item);
          this._addItemToMenu(list, item, _(selectedValue).isEqual(itemValue));
        }, this);

        // wrap them up in a scroller 
        this.scroller = new Backbone.UI.Scroller({
          content : list
        }).render();

        // Prevent scroll events from percolating out to the enclosing doc
        $(this.scroller.el).bind('mousewheel', function(){return false;});
        $(this.scroller.el).addClass('menu_scroller');

        this.el.appendChild(this.scroller.el);
      }
      else {
        
        this.select = $.el.select({className : 'mobile'});
        
        _(this._collectionArray()).each(function(item){
          this.select.appendChild($.el.option({value : this._valueForItem(item)},
            this._labelForItem(item)));
        }, this);
        
        $(this.select).val(this._valueForItem(this._determineSelectedItem()));
        
        $(this.select).change(_(function(){
          var itemValue = $(this.select).val();
          var itemLabel = $('option:selected', this.select).text();
          var item = {};
          item[this.options.altLabelContent] = itemLabel;
          item[this.options.altValueContent] = itemValue;
          this._setSelectedItem(_(item).isEqual(this.options.emptyItem) ? null : item);
        }).bind(this));
        
        this.el.appendChild(this.select);        
      }
      
      return this;
    },

    scrollToSelectedItem : function() {
      var pos = !this._selectedAnchor ? 0 : 
        $(this._selectedAnchor.parentNode).position().top - 10;
      this.scroller.setScrollPosition(pos);
    },

    width : function() {
      return $(this.scroller.el).innerWidth();
    },

    // Adds the given item (creating a new li element) 
    // to the given menu ul element
    _addItemToMenu : function(menu, item, select) {
      var anchor = $.el.a({href : '#'});
      
      var liElement = $.el.li(anchor);
      $.el.span(this._labelForItem(item) || '\u00a0').appendTo(anchor);
      
      var clickFunction = _.bind(function(e, silent) {

        if(!!this._selectedAnchor) $(this._selectedAnchor).removeClass('selected');
        this._selectedAnchor = anchor;
        $(anchor).addClass('selected');

         //check if item selected actually changed
        var changed = this._determineSelectedItem() !== item;

        if(_(this.options.onChange).isFunction() && changed) this.options.onChange(item);

        this._setSelectedItem(_(item).isEqual(this.options.emptyItem) ? null : item, silent);

        return false;
      }, this);

      $(anchor).click(clickFunction);

      if(select) clickFunction(null, true);

      menu.appendChild(liElement);
    },

    _labelForItem : function(item) {
      return !_(item).exists() ? this.options.placeholder : 
        this.resolveContent(item, this.options.altLabelContent);
    }
  });
}());

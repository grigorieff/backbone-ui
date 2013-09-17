(function(){
  window.Backbone.UI.Menu = Backbone.View.extend({

    options : {
      
      // an additional item to render at the top of the menu to 
      // denote the lack of a selection
      emptyItem : null,

      // A callback to invoke with a particular item when that item is
      // selected from the menu.
      onChange : Backbone.UI.noop,
      
      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',
      
      // number of option items to display in the menu
      size : 1
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);

      _(this).bindAll('render');

      $(this.el).addClass('menu');

    },


    render : function() {
      $(this.el).empty();
      
      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem();
      // || this.selectedItem;
      var selectedValue = this._valueForItem(this.selectedItem);
      
      this.select = $.el.select({ size : this.options.size });
      
      // setup events for each input in collection
      $(this.select).change(_(this._updateModel).bind(this));
      
      var selectedOffset = 0;
      
      // append placeholder option if no selectedItem
      this._placeholder = null;
      if(!this.options.emptyItem && (this.options.size === 1) && !selectedValue) {
        this._placeholder = $.el.option(this.options.placeholder);
        $(this._placeholder).data('value', null);
        $(this._placeholder).attr({ disabled : 'true' });
        this.select.appendChild(this._placeholder);
        // adjust for placeholder option
        selectedOffset++;
      }
      
      if(this.options.emptyItem) {
        
        this._emptyItem = $.el.option(this._labelForItem(this.options.emptyItem));
        $(this._emptyItem).data('value', null);
        this.select.appendChild(this._emptyItem);
        $(this._emptyItem).click(_(function() {
          this.select.selectedIndex = 0;
          this._updateModel();
        }).bind(this));
        // adjust for emptyItem option
        selectedOffset++;
      }
      
      // default selectedIndex as placeholder if exists
      this._selectedIndex = -1 + selectedOffset;
      
      _(this._collectionArray()).each(function(item, idx) {
        
        // adjust index for potential placeholder and emptyItem
        idx = idx + selectedOffset;
        
        var val = this._valueForItem(item);
        if(_(selectedValue).isEqual(val)) {
          this._selectedIndex = idx;
        }
        
        var option = $.el.option(this._labelForItem(item));
        $(option).data('value', val);
        
        $(option).click(_(function(selectedIdx) {
          this.select.selectedIndex = selectedIdx;
          this._updateModel();
        }).bind(this, idx));
        
        this.select.appendChild(option);
        
      }, this);
      
      // set the selectedIndex on the select element
      this.select.selectedIndex = this._selectedIndex;
            
      this.el.appendChild(this.select);
      
      return this;
    },

    setEnabled : function(enabled) {
      if(this.button) this.button.setEnabled(enabled);
    },

    _labelForItem : function(item) {
      return !_(item).exists() ? this.options.placeholder : 
        this.resolveContent(item, this.options.altLabelContent);
    },

    // sets the selected item
    setSelectedItem : function(item) {
      this._setSelectedItem(item);
      $(this._placeholder).remove();
    },
    
    _updateModel : function() {
      var item = this._itemForValue($(this.select.options[this.select.selectedIndex]).data('value'));
      var changed = this.selectedItem !== item;
      this._setSelectedItem(item);
      // if onChange function exists call it
      if(_(this.options.onChange).isFunction() && changed) {
        this.options.onChange(item);
      }  
    },
    
    _itemForValue : function(val) {
      if(val === null) {
        return val;
      }
      var item = _(this._collectionArray()).find(function(item) {
        var isItem = val === item;
        var itemHasValue = this.resolveContent(item, this.options.altValueContent) === val;
        return isItem || itemHasValue;
      }, this);
      
      return item;
    }
    
    
    
    // scrollToSelectedItem : function() {
    //       var pos = !this._selectedAnchor ? 0 : 
    //         $(this._selectedAnchor.parentNode).position().top - 10;
    //       this.scroller.setScrollPosition(pos);
    //     }

  });
}());

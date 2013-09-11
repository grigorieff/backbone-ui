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
      this.mixin([Backbone.UI.HasModel, Backbone.UI.HasAlternativeProperty]);
      _(this).bindAll('render');

      $(this.el).addClass('pulldown');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }
      
    },

    // public accessors 
    //button : null,

    render : function() {
      $(this.el).empty();
      
      this._observeModel(this.render);
      this._observeCollection(this.render);

      this.selectedItem = this._determineSelectedItem() || this.selectedItem;
      var selectedValue = this._valueForItem(this.selectedItem);
      
      this.select = $.el.select();
      
      // setup events for each input in collection
      $(this.select).change(_(this._updateModel).bind(this));
      
      // append placeholder option if no selectedItem
      var placeholder = $.el.option(this.options.placeholder);
      $(placeholder).data('value', null);
      // placeholder is not selectable if there is no emptyItem set
      if(!this.options.emptyItem) {
        $(placeholder).attr({ disabled : 'true' });
        $(placeholder).click(_(function() {
          this.select.selectedIndex = 0;
          this._updateModel();
        }).bind(this));
      }
      this.select.appendChild(placeholder);
      // default selectedIndex is placeholder
      this._selectedIndex = 0;
      
      _(this._collectionArray()).each(function(item, idx) {
        // account for placeholder (add 1)
        idx++;
        var val = this._valueForItem(item);
        if(selectedValue === val) {
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
    },
    
    _updateModel : function() {
      var item = $(this.select.options[this.select.selectedIndex]).data('value');
      var changed = this.selectedItem !== item;
      this._setSelectedItem(item);
      // if onChange function exists call it
      if(_(this.options.onChange).isFunction() && changed) {
        this.options.onChange(item);
      }  
    }
        
  });
}());

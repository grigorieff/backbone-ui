(function(){
  window.Backbone.UI.Pulldown = Backbone.View.extend({
    options : {
      // text to place in the pulldown button before a
      // selection has been made
      placeholder : 'Select...',

      // A callback to invoke with a particular item when that item is
      // selected from the pulldown menu.
      onChange : Backbone.UI.noop,

      // an additional item to render at the top of the menu to 
      // denote the lack of a selection
      emptyItem : null
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
      var selectedValue = this._valueForItem(this.selectedItem).cid;
      
      this.select = $.el.select();
      // setup events for each input in collection
      $(this.select).change(_(this._updateModel).bind(this));
      
      this._selectedIndex = null;
      _(this._collectionArray()).each(function(item, idx) {

        var val = this._valueForItem(item).cid;
        if(selectedValue === val) {
          this._selectedIndex = idx;
        }
        
        var option = $.el.option(this._labelForItem(item));
        $(option).attr({value : val});
        
        $(option).click(_(this._updateModel).bind(this, item));
        
        this.select.appendChild(option);
        
      }, this);
      
      if(_(this._selectedIndex).isNumber()) {
        this.select.selectedIndex = this._selectedIndex;
      }
      
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
    
    _updateModel : function(item) {
      
      item = !!item ? item : this.options.alternatives.getByCid(
        this.select.options[this.select.selectedIndex].value);
      // check if item selected actually changed
      var changed = this.selectedItem !== item;
      this._setSelectedItem(item);
      // if onChange function exists call it
      if(_(this.options.onChange).isFunction() && changed) {
        this.options.onChange(item);
      }  
    }
        
  });
}());

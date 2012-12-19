(function(){
  window.Backbone.UI.Label = Backbone.View.extend({
    options : {
      tagName : 'span'
    },

    initialize : function() {
      this.mixin([Backbone.UI.HasModel]);

      _(this).bindAll('render');

      $(this.el).addClass('label');
      if(this.options.name){
        $(this.el).addClass(this.options.name);
      }

    },

    render : function() {
      var labelText = this.resolveContent(this.model, this.options.labelContent) || this.options.labelContent;
      this._observeModel(this.render);

      $(this.el).empty();
      
      // insert label
      this.el.appendChild(document.createTextNode(labelText));

      return this;
    }
    
  });
}());


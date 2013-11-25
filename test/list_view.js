$(document).ready(function() {

  module("Backbone.ListView");

  test("withDataBinding", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var Item = Backbone.View.extend({
      render: function() {
        $(this.el).empty();
        $.el.div(this.model.get('name')).appendTo(this.el);
      }
    });

    var list = new Backbone.UI.List({
      model: regions,
      itemView: Item
    }).render();

    //check table has two rows
    equal($(list.el).find('li').length,2);

    //add item to regions
    var newItem = { name: 'Hawaii', notes: 'Nutty'};
    regions.add(newItem);
    equal($(list.el).find('li').length,3);
    equal($(list.el).find('li.last').text(),'Hawaii');

  });

});
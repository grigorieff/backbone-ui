$(document).ready(function() {

  module("Backbone.UI.Pulldown");

  Backbone.UI.setMobile(false);

  test("withoutDataBinding", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    $(pulldown.el).find('input').click();
    $(pulldown._menu.el).find('li a').eq(0).click();

    equal($(pulldown.el).find('.label').text(),'Americas');


  });


  test("withDataBinding", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var pulldown = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    $('body').append(pulldown.el);

    $(pulldown.el).find('input').click();
    $(pulldown._menu.el).find('li a').eq(1).click();

    equal(coffee.get('region').get('name'),'Africa');

  });

  test("emptyItem", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var pulldown = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      emptyItem: true
    }).render();

    $('body').append(pulldown.el);

    $(pulldown.el).find('input').click();
    $(pulldown._menu.el).find('li a').eq(0).click();

    equal(coffee.get('region'),null);

  });

  test("triggers the onChange callback", function() {

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var changeEvents = 0, itemClicked;

    var pulldown = new Backbone.UI.Pulldown({
      model: coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      onChange: function (item) {
        itemClicked = item;
        changeEvents++;
      }
    }).render();

    pulldown.$('.pulldown_button').click();
    pulldown._menu.$('.content a').eq(1).click();

    equal(changeEvents, 1);
    equal(itemClicked, regions.at(1));
  });
});
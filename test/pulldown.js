$(document).ready(function() {

  module("Backbone.UI.Pulldown");

  Backbone.UI.setMobile(false);

  var regions = new Backbone.Collection([{
    name: 'Americas',
    notes: 'Bright'
  }, {
    name: 'Africa',
    notes: 'Fruity'
  }]);

  test("withoutDataBinding", function(){

    var pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name'
    }).render();

    pulldown.$('.pulldown_button').click();
    $(pulldown._menu.el).find('li a').eq(0).click();

    equal($(pulldown.el).find('.label').text(),'Americas');

  });

  test("withDataBinding", function(){

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

    pulldown.$('.pulldown_button').click();
    $(pulldown._menu.el).find('li a').eq(1).click();

    equal(coffee.get('region').get('name'),'Africa');

  });

  test("onMenuShow", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var changeEvents = 0;

    var pulldown = new Backbone.UI.Pulldown({
      model: coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      onMenuShow: function () {
        changeEvents++;
      }
    }).render();

    //click pulldown
    pulldown.$('.pulldown_button').click();

    //check if menu show was called
    equal(changeEvents, 1);

    pulldown._menu.$('.content a').eq(1).click();
  });

  test("placeholder", function(){

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
      placeholder: "Select a region..."
    }).render();

    //check the label on pulldown
    equal($(pulldown.el).find('.label').text(),"Select a region...");

  });

  test("onMenuHide", function() {

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var changeEvents = 0;

    var pulldown = new Backbone.UI.Pulldown({
      model: coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      onMenuHide: function () {
        changeEvents++;
      }
    }).render();

    //click pulldown
    pulldown.$('.pulldown_button').click();
    //make selection to hide menu
    pulldown._menu.$('.content a').eq(1).click();

    //check if menu hide was called
    equal(changeEvents, 1);

  });

  test("onChange", function() {

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

  test("emptyItem", function(){

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

    //select emptyItem
    pulldown.$('.pulldown_button').click();
    $(pulldown._menu.el).find('li a').eq(0).click();

    //check if selection is empty
    equal(coffee.get('region'),null);

  });

  test("alignRight", function(){

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
      alignRight : true
    }).render();

    //click to display menu
    pulldown.$('.pulldown_button').click();    
    //check the label on pulldown
    equal($(pulldown._menu.el).css('left').substring(0,1),'-');

  });
});
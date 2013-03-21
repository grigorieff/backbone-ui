$(document).ready(function() {

  module("Backbone.UI.Pulldown");

  test("triggers the onChange callback", function() {

    Backbone.UI.setMobile(false);

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
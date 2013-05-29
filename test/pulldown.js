$(document).ready(function() {

  module("Backbone.UI.Pulldown");

  Backbone.UI.setMobile(false);

  var regions = new Backbone.Collection([{
    name: 'Americas',
    notes: 'Bright',
    glyphCss : 'url(americaLeft.png) top left'
  }, {
    name: 'Africa',
    notes: 'Fruity',
    glyphRightCss : 'url(africaRight.png) top left'
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

    var pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name',
      placeholder: 'Select a region...'
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

  test("issue 31 - remove pulldown-add pulldown-double fire", function(){

    var changeEvents = 0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true,
      region: regions.at(0)
    });

    var pulldown1 = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      emptyItem: true,
      onChange: function (item) {
        changeEvents++;
      }
    }).render();

    pulldown1.remove();

    var pulldown2 = new Backbone.UI.Pulldown({
      model : coffee,
      content: 'region',
      alternatives: regions,
      altLabelContent: 'name',
      onChange: function (item) {
        changeEvents++;
      }
    }).render();

    pulldown2.$('.pulldown_button').click();
    pulldown2._menu.$('.content a').eq(1).click();

    equal(changeEvents, 1);
  });

  test("glyphs with data binding", function() {
    var pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name',
      altGlyphCss : 'glyphCss'
    }).render();

    var leftImage = $(pulldown._menu.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/americaLeft.png"?\)$/.test(leftImage));
    ok(!$(pulldown._menu.el).find('.glyph.right')[0]);

    pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name',
      altGlyphRightCss : 'glyphRightCss'
    }).render();

    var rightImage = $(pulldown._menu.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/africaRight.png\)$/.test(rightImage));
    ok(!$(pulldown._menu.el).find('.glyph.left')[0]);

    pulldown = new Backbone.UI.Pulldown({
      content: 'test',
      alternatives: regions,
      altLabelContent: 'name',
      altGlyphCss : 'glyphCss',
      altGlyphRightCss : 'glyphRightCss'
    }).render();

    leftImage = $(pulldown._menu.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/americaLeft.png\)$/.test(leftImage));

    rightImage = $(pulldown._menu.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/africaRight.png\)$/.test(rightImage));
  });
});

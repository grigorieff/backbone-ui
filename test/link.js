$(document).ready(function() {

  module("Backbone.UI.Link");

  test("withoutDataBinding", function() {
    var link = new Backbone.UI.Link({
      content : 'foo',
    }).render();

    var text = $(link.el).find('.label').text();
    equal(text, 'foo');

  });

  test("withDataBinding", function() {
    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var link = new Backbone.UI.Link({
      model : coffee,
      content : 'roaster'
    }).render();

    // label should be rendered from the 'descripton' property
    var text = $(link.el).find('.label').text();
    equal(text, 'Counter Culture');

    // update our model
    coffee.set({
      roaster : 'La Colombe'
    });

    // text should have changed
    text = $(link.el).find('.label').text();
    equal(text, 'La Colombe');

  });

  test("disabled", function() {
    var clickCount=0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var link = new Backbone.UI.Link({
      model : coffee,
      content : 'roaster',
      disabled : true,
      onClick : function() { clickCount++; }
    }).render();

    ok($(link.el).hasClass('disabled'));
    $(link.el).click();
    equal(clickCount,0);

  });

  test("onClick", function() {
    var clickCount=0;

    var coffee = new Backbone.Model({
      roaster: 'Counter Culture',
      name: 'Baroida',
      roastedOn: new Date(2012, 2, 28, 6, 30),
      acidic: true
    });

    var link = new Backbone.UI.Link({
      model : coffee,
      content : 'roaster',
      onClick : function() { clickCount++; }
    }).render();

    $(link.el).click();
    equal(clickCount,1);

  });

  test("glyphNoBindingLeft", function() {
    var link = new Backbone.UI.Link({
      content : 'foo',
      glyphCss : "url(left.png) top left no-repeat"
    }).render();

    var leftImage = $(link.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    ok(!$(link.el).find('.glyph.right')[0]);
  });

  test("glyphNoBindingRight", function() {
    var link = new Backbone.UI.Link({
      content : 'foo',
      glyphRightCss : "url(right.png) top left no-repeat"
    }).render();

    var rightImage = $(link.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));

    ok(!$(link.el).find('.glyph.left')[0]);
  });

  test("glyphNoBindingLeftRight", function() {
    var link = new Backbone.UI.Link({
      content : 'foo',
      glyphCss : "url(left.png) top left no-repeat",
      glyphRightCss : "url(right.png) top left no-repeat"
    }).render();

    var leftImage = $(link.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    var rightImage = $(link.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));
  });

  test("glyphBindingLeft", function() {
    var model = new Backbone.Model({
      label : 'foo',
      gl : 'url(left.png) top left no-repeat'
    });

    var link = new Backbone.UI.Link({
      model : model,
      content : 'label',
      glyphCss : 'gl'
    }).render();

    var leftImage = $(link.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    ok(!$(link.el).find('.glyph.right')[0]);
  });

  test("glyphBindingRight", function() {
    var model = new Backbone.Model({
      label : 'foo',
      gr : 'url(right.png) top left no-repeat'
    });

    var link = new Backbone.UI.Link({
      model : model,
      content : 'label',
      glyphRightCss : 'gr'
    }).render();

    var rightImage = $(link.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));

    ok(!$(link.el).find('.glyph.left')[0]);
  });

  test("glyphBindingLeftRight", function() {
    var model = new Backbone.Model({
      label : 'foo',
      gl : 'url(left.png) top left no-repeat',
      gr : 'url(right.png) top left no-repeat'
    });

    var link = new Backbone.UI.Link({
      model : model,
      content : 'label',
      glyphCss : 'gl',
      glyphRightCss : 'gr'
    }).render();

    var leftImage = $(link.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    var rightImage = $(link.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));
  });
});

$(document).ready(function() {

  module("Backbone.UI.Button");

  test("withoutDataBinding", function() {
    var button = new Backbone.UI.Button({
      content : 'foo'
    }).render();

    var text = $(button.el).find('.label').text();
    equal(text, 'foo');
  });

  test("withDataBinding", function() {
    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo'
    }).render();

    // text should be based on 'foo' property
    var text = $(button.el).find('.label').text();
    equal(text, 'bar');

    // update the foo property
    model.set({foo : 'baz'});

    // text should have changed
    text = $(button.el).find('.label').text();
    equal(text, 'baz');
  });

  test("disabled", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      disabled : true,
      onClick : function() { clickCount++; }
    }).render();

    ok($(button.el).hasClass('disabled'));
    $(button.el).click();

    equal(clickCount, 0);
  });

  test("active", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      active : true,
      onClick : function() { clickCount++; }
    }).render();

    ok($(button.el).hasClass('active'));
    $(button.el).click();

    equal(clickCount, 0);
  });

  test("onClick", function() {
    var clickCount=0;

    var model = new Backbone.Model({
      foo : 'bar'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'foo',
      onClick : function() { clickCount++; }
    }).render();

    $(button.el).click();
    equal(clickCount, 1);
  });

  test("isSubmit", function() {
    var button = new Backbone.UI.Button({
      label : 'foo',
      isSubmit : true
    }).render();

    var inputs = $(button.el).find('input[type=submit]');
    equal(inputs.length, 1);
  });

  test("glyphNoBindingLeft", function() {
    var button = new Backbone.UI.Button({
      content : 'foo',
      glyphCss : "url(left.png) top left no-repeat"
    }).render();

    var leftImage = $(button.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    ok(!$(button.el).find('.glyph.right')[0]);
  });

  test("glyphNoBindingRight", function() {
    var button = new Backbone.UI.Button({
      content : 'foo',
      glyphRightCss : "url(right.png) top left no-repeat"
    }).render();

    ok(!$(button.el).find('.glyph.left')[0]);

    var rightImage = $(button.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));
  });

  test("glyphNoBindingLeftRight", function() {
    var button = new Backbone.UI.Button({
      content : 'foo',
      glyphCss : "url(left.png) top left no-repeat",
      glyphRightCss : "url(right.png) top left no-repeat"
    }).render();

    var leftImage = $(button.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    var rightImage = $(button.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));
  });

  test("glyphBindingLeft", function() {
    var model = new Backbone.Model({
      label : 'foo',
      gl : 'url(left.png) top left no-repeat'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'label',
      glyphCss : 'gl'
    }).render();

    var leftImage = $(button.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    ok(!$(button.el).find('.glyph.right')[0]);
  });

  test("glyphBindingRight", function() {
    var model = new Backbone.Model({
      label : 'foo',
      gr : 'url(right.png) top left no-repeat'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'label',
      glyphRightCss : 'gr'
    }).render();

    var rightImage = $(button.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));

    ok(!$(button.el).find('.glyph.left')[0]);
  });

  test("glyphBindingLeftRight", function() {
    var model = new Backbone.Model({
      label : 'foo',
      gl : 'url(left.png) top left no-repeat',
      gr : 'url(right.png) top left no-repeat'
    });

    var button = new Backbone.UI.Button({
      model : model,
      content : 'label',
      glyphCss : 'gl',
      glyphRightCss : 'gr'
    }).render();

    var leftImage = $(button.el).find('.glyph.left')[0].style.backgroundImage;
    ok(/left.png"?\)$/.test(leftImage));

    var rightImage = $(button.el).find('.glyph.right')[0].style.backgroundImage;
    ok(/right.png"?\)$/.test(rightImage));
  });
});

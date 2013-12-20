$(document).ready(function() {

  module("Backbone.UI.Util");

  test("alignToTest", function() {

    this._container = $.el.div(
      this._relativeDiv = $.el.div(
        this._absoluteDiv = $.el.div()));

    this._container.style.position = 'absolute';
    this._container.style.top = '100px';
    this._container.style.left = '100px';
    this._container.style.padding = '200px';

    this._relativeDiv.style.marginLeft = '100px';

    this._absoluteDiv.style.position = 'absolute';
    this._absoluteDiv.style.top = '50px';
    this._absoluteDiv.style.left = '50px';

    document.body.appendChild(this._container);

    var cOffset = _(this._container).offsetEl();
    var rOffset = _(this._relativeDiv).offsetEl();
    var aOffset = _(this._absoluteDiv).offsetEl();

    equal(cOffset.x, 100);
    equal(cOffset.y, 100);
    equal(rOffset.x, 400);
    equal(rOffset.y, 300);
    equal(aOffset.x, 150);
    equal(aOffset.y, 150);

    var cOffset2 = $(this._container).offset();
    var rOffset2 = $(this._relativeDiv).offset();
    var aOffset2 = $(this._absoluteDiv).offset();

    equal(cOffset2.left, 100);
    equal(cOffset2.top, 100);
    equal(rOffset2.left, 400);
    equal(rOffset2.top, 300);
    equal(aOffset2.left, 150);
    equal(aOffset2.top, 150);

  });

  test("removeElTest", function() {

    var container = $.el.div();
    var first = $.el.div();
    var second = $.el.div();
    container.appendChild(first);
    container.appendChild(second);
    document.body.appendChild(container);

    ok($(container).is(':visible'));
    ok($(first).is(':visible'));
    ok($(second).is(':visible'));

    _(first).removeEl();

    ok($(container).is(':visible'));
    ok(!$(first).is(':visible'));
    ok($(second).is(':visible'));

    _(container).removeEl();

    ok(!$(container).is(':visible'));
    ok(!$(first).is(':visible'));
    ok(!$(second).is(':visible'));  

    document.body.appendChild(container);

    ok($(container).is(':visible'));
    ok(!$(first).is(':visible'));
    ok($(second).is(':visible'));

    container.appendChild(first);

    ok($(container).is(':visible'));
    ok($(first).is(':visible'));
    ok($(second).is(':visible'));

  });

  test("classNameTest", function() {
    var textfield = new Backbone.UI.TextField({
      className : 'hello world',
      content : 'foo'
    }).render();

    ok($(textfield.el).hasClass('text_field'));
    ok($(textfield.el).hasClass('hello'));
    ok($(textfield.el).hasClass('world'));

    _(textfield.el).removeClass('hello');

    ok(!$(textfield.el).hasClass('hello'));
    equal(textfield.el.className, 'world text_field');

  });

  // tests a bean event handler
  // with a Syn event (synthetic event library)
  asyncTest("beanOnSynClickLink", function() {
    
    expect(1);

    var counter = 0;
    var inc = function(e) {
      e.preventDefault();
      counter++;
      start(); 
    };

    var link = $.el.a({href : '#'});
    bean.on(link, 'click', inc);
    
    Syn.click(link, function() {
      equal(counter, 1, '1 click');
    });

  });

  // tests a bean event handler
  // with a bean event
  test("beanClickLink", function() {

    var counter = 0;
    var inc = function(e) {
      e.preventDefault();
      counter++;
    };

    var link = $.el.a({href : '#'});
    bean.on(link, 'click', inc);
    bean.fire(link, 'click');
    equal(counter, 1, '1 click');

  });

  // tests a jQuery event handler
  // with a jQuery event
  test("jQueryClickLink", function() {

    var counter = 0;
    var inc = function(e) {
      e.preventDefault();
      counter++;
    };
    var link = $.el.a({href : '#'});
    $(link).on('click', inc);
    $(link).click();
    equal(counter, 1, '1 click');

  });

  // tests a jQuery event handler
  // with a bean event
  test("jQueryOnBeanFireClickLink", function() {

    var counter = 0;
    var inc = function(e) {
      e.preventDefault();
      counter++;
    };
    var link = $.el.a({href : '#'});
    $(link).on('click', inc);
    bean.fire(link, 'click');
    equal(counter, 1, '1 click');

  });

  /*
  // tests a bean event handler
  // with a jQuery event
  test("beanOnjQueryClickLink", function() {

    var counter = 0;
    var inc = function(e) {
      e.preventDefault();
      counter++;
    };
    var link = $.el.a({href : '#'});
    bean.on(link, 'click', inc);
    $(link).click();
    equal(counter, 1, '1 click');

  });
  */




  test("boundingRectTest", function() {

    var container = $.el.div();
    var relative = $.el.div();
    var absolute = $.el.div();

    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.left = '100px';

    relative.style.position = 'relative';
    relative.style.margin = '100px';

    absolute.style.position = 'absolute';
    absolute.style.top = '50px';
    absolute.style.left = '50px';

    relative.appendChild(absolute);
    container.appendChild(relative);
    document.body.appendChild(container);

    var containerRect = container.getBoundingClientRect();
    var relativeRect = relative.getBoundingClientRect();
    var absoluteRect = absolute.getBoundingClientRect();

    equal(containerRect.top, 10);
    equal(containerRect.left, 100);
    equal(relativeRect.top, 110);
    equal(relativeRect.left, 200);
    equal(absoluteRect.top, 160);
    equal(absoluteRect.left, 250);
  });

});

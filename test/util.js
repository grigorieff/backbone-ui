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
    
    this._container = $.el.div(
      this._first = $.el.div(),
      this._second = $.el.div());
    
    document.body.appendChild(this._container);
    
    ok($(this._container).is(':visible'));
    ok($(this._first).is(':visible'));
    ok($(this._second).is(':visible'));
    
    _(this._first).removeEl();
    
    ok($(this._container).is(':visible'));
    ok(!$(this._first).is(':visible'));
    ok($(this._second).is(':visible'));
      
    _(this._container).removeEl();
    
    ok(!$(this._container).is(':visible'));
    ok(!$(this._first).is(':visible'));
    ok(!$(this._second).is(':visible'));  
    
    document.body.appendChild(this._container);
    
    ok($(this._container).is(':visible'));
    ok(!$(this._first).is(':visible'));
    ok($(this._second).is(':visible'));
    
    this._container.appendChild(this._first);
    
    ok($(this._container).is(':visible'));
    ok($(this._first).is(':visible'));
    ok($(this._second).is(':visible'));
    
    
  });
  
  
  test("hasErrorTest", function() {
    // create a textfield
    var text = new Backbone.UI.TextField({
      content : 'hasErrorTest',
      formLabelContent : 'Name of this test',
      errorType : 'disclosure',
      errorPosition : 'right'
    }).render();
    // append this textfield to document.body
    document.body.appendChild(text.el);
    // should be no disclosure 
    equal($(text._disclosure).length, 0);
    // set and error
    text.setError('show error now!');
    // disclosure should exist and be visible
    equal($(text._disclosure).length, 1);
    ok($(text._disclosure).is(':visible'));
    // click the textfield
    $(text.el).click();
    // disclosure should be removed from the dom
    // making it not visible any longer
    ok(!$(text._disclosure).is(':visible'));
    // click on the error "!"
    $(text.errorMessage).click();
    // disclosure should be appended to the dom
    // once again making it visible
    ok($(text._disclosure).is(':visible'));
    // clean up the test
    _(text.el).removeEl();
    
  });
  

});

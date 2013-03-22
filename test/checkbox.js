$(document).ready(function() {

  module("Backbone.UI.Checkbox");

  test("withoutDataBinding", function() {
    var checkbox = new Backbone.UI.Checkbox({
      content : 'foo',
      checked : true
    }).render();

    var text = $(checkbox.el).find('.label').text();
    equal(text, 'foo');

    var mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,1);

    checkbox = new Backbone.UI.Checkbox({
      label : 'foo',
      checked : false
    }).render();

    mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,0);

  });

  test("withDataBinding and labelContent", function() {
    var model = new Backbone.Model({
      description : 'property name',
      active : true
    });

    var checkbox = new Backbone.UI.Checkbox({
      model : model,
      content : 'active',
      labelContent : 'description'
    }).render();

    // label should be rendered from the 'descripton' property
    var text = $(checkbox.el).find('.label').text();
    equal(text, 'property name');

    // checkmark should be active based on the 'active' property
    var mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,1);

    // update our model
    model.set({
      active : false,
      description : 'baz'
    });

    // text should have changed
    text = $(checkbox.el).find('.label').text();
    equal(text, 'baz');

    // and we should not have a checkmark fill
    mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,0);

    //check
    $(checkbox.el).click();
    mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,1);
    equal(model.get('active'),true);

    //uncheck
    $(checkbox.el).click();
    mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,0);
    equal(model.get('active'),false);

  });

  test("disabled", function() {
    var model = new Backbone.Model({
      description : 'property name',
      active : true
    });

    var checkbox = new Backbone.UI.Checkbox({
      model : model,
      content : 'active',
      labelContent : 'description',
      disabled : true
    }).render();

    //try to uncheck
    $(checkbox.el).click();
    mark = $(checkbox.el).find('.checkmark_fill');
    equal(mark.length,1);
    equal(model.get('active'),true);

  });

});

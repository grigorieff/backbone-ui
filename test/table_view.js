$(document).ready(function() {

  module("Backbone.TableView");

  Backbone.UI.setMobile(false);

  test("withDataBinding", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var table = new Backbone.UI.TableView({
      model: regions,
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //check table has two rows
    equal($(table.el).find('.content tr').length,2);

    //add item to regions
    var newItem = { name: 'Hawaii', notes: 'Nutty'};
    regions.push(newItem);
    equal($(table.el).find('.content tr').length,3);
    equal($(table.el).find('.content tr.last td.first').text(),'Hawaii');

  });

  test("onItemClick", function(){
    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var clickCount = 0;

    var table = new Backbone.UI.TableView({
      model: regions,
      onItemClick: function(model) {
        clickCount++;
      },
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //click two rows
    $(table.el).find('.content tr.first').click();
    $(table.el).find('.content tr.last').click();
    equal(clickCount,2);

  }); 

  test("sortable", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var table = new Backbone.UI.TableView({
      sortable: true,
      model: regions,
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    $('body').append(table.el);

    //add item to regions
    var newItem = { name: 'Hawaii', notes: 'Nutty'};
    regions.push(newItem);

    //click name header column to sort ascending
    $(table.el).find('.heading th.first').click();
    equal($(table.el).find('.content tr.first td.first').text(),'Africa');

    //click name header column to sort descending
    $(table.el).find('.heading th.first').click();
    equal($(table.el).find('.content tr.first td.first').text(),'Hawaii');

    //click notes header column to sort ascending
    $(table.el).find('.heading th.last').click();
    equal($(table.el).find('.content tr.first td.last').text(),'Bright');

    //click notes header column to sort descending
    $(table.el).find('.heading th.last').click();
    equal($(table.el).find('.content tr.first td.last').text(),'Nutty');
    
  }); 

  test("onSort", function(){

    var regions = new Backbone.Collection([{
      name: 'Americas',
      notes: 'Bright'
    }, {
      name: 'Africa',
      notes: 'Fruity'
    }]);

    var sortCount = 0;

    var table = new Backbone.UI.TableView({
      sortable: true,
      model: regions,
      onSort: function(model) {
        sortCount++;
      },
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    //click a header column to check if onSort is called
    $(table.el).find('.heading th.first').click();
    equal(sortCount,1);

  }); 

  test("emptyContent", function(){
    var regions=null;

    var table = new Backbone.UI.TableView({
      model: regions,
      emptyContent: 'empty',
      columns: [{
        title: 'Name',
        content: 'name'
      }, {
        title: 'Notes',
        width: 100,
        content: 'notes'
      }]
    }).render();

    equal($(table.el).find('.content tr.first td').text(),'empty');

  });

});
var Backbone = this.Backbone || require('backbone');
var _ = require('underscore');
var $ = require('./util');

var currentSkin;

exports.setSkin = function(skin) {
  if (currentSkin) {
    $(document.body).removeClass('skin_' + currentSkin);
  }
  $(document.body).addClass('skin_' + skin);
  currentSkin = skin;
};

exports.BaseView = require('./base_view');
exports.Button = require('./button');
exports.Calendar = require('./calendar');
exports.Checkbox = require('./checkbox');
exports.CollectionView = require('./collection_view');
exports.DatePicker = require('./date_picker');
exports.HasAlternativeProperty = require('./has_alternative_property');
exports.HasError = require('./has_error');
exports.HasFocus = require('./has_focus');
exports.HasFormLabel = require('./has_form_label');
exports.HasGlyph = require('./has_glyph');
exports.HasModel = require('./has_model');
exports.HasTextInput = require('./has_text_input');
exports.Label = require('./label');
exports.Link = require('./link');
exports.List = require('./list');
exports.Menu = require('./menu');
exports.Pulldown = require('./pulldown');
exports.RadioGroup = require('./radio_group');
exports.TableView = require('./table_view');
exports.TabSet = require('./tab_set');
exports.TextArea = require('./text_area');
exports.TextField = require('./text_field');
exports.TimePicker = require('./time_picker');
exports.Util = $;

exports.KEYS = require('./keys');

// Add some utility methods to underscore
_.mixin({
  // produces a natural language description of the given
  // index in the given list
  nameForIndex: function(list, index) {
    return list.length === 1 ? 'first last' :
      index === 0 ? 'first' :
      index === list.length - 1 ?
      'last' : 'middle';
  },

  exists: function(object) {
    return !_(object).isNull() && !_(object).isUndefined();
  },

  // resolves the value of the given property on the given
  // object.
  resolveProperty: function(object, property) {
    var result = null;
    if(_(property).exists() && _(property).isString()) {
      var parts = property.split('.');
      _(parts).each(function(part) {
        if(_(object).exists()) {
          var target = result || object;
          result = _(target.get).isFunction() ? target.get(part) : target[part];
        }
      });
    }

    return result;
  },

  // sets the given value for the given property on the given
  // object.
  setProperty: function(object, property, value, silent) {
    if(!property) return;

    var parts = property.split('.');
    _(parts.slice(0, parts.length - 2)).each(function(part) {
      if(!_(object).isNull() && !_(object).isUndefined()){
        object = _(object.get).isFunction() ? object.get(part) : object[part];
      }
    });

    if(!!object) {
      if(_(object.set).isFunction()) {
        var attributes = {};
        attributes[property] = value;
        object.set(attributes, {silent: silent});
      }
      else {
        object[property] = value;
      }
    }
  }
});

// Set up DOM support for Backbone
if (!_(Backbone.$).exists()) {
  Backbone.$ = exports.Util;
}

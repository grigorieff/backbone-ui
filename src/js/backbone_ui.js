var Backbone = this.Backbone || require('backbone');
var _ = require('underscore');
var $ = require('./util');

exports.KEYS = {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,
  KEY_HOME:     36,
  KEY_END:      35,
  KEY_PAGEUP:   33,
  KEY_PAGEDOWN: 34,
  KEY_INSERT:   45
};

var currentSkin;

exports.setSkin = function(skin) {
  if (currentSkin) {
    $(document.body).removeClass('skin_' + currentSkin);
  }
  $(document.body).addClass('skin_' + skin);
  currentSkin = skin;
};

exports.noop = function() { };

// BaseView automatically attaches options, as Backbone.View did prior to
// version 1.1.0
exports.BaseView = Backbone.View.extend({
  initialize: function(options) {
    this.options = this.options ? _({}).extend(this.options, options) : options;
  }
});

var viewMixins = {
  // resolves the appropriate content from the given choices
  resolveContent: function(model, content, defaultOption) {
    defaultOption = (defaultOption === null || _(defaultOption).isUndefined()) ?
      this.options.content : defaultOption;
    model = _(model).exists() ? model : this.model;
    content = _(content).exists() ? content : defaultOption;
    var hasModelProperty = _(model).exists() && _(content).exists();
    return _(content).isFunction() ? content(model) :
      hasModelProperty && _(model[content]).isFunction() ? model[content]() :
      hasModelProperty && _(_(model).resolveProperty(content)).isFunction() ? _(model).resolveProperty(content)(model) :
      hasModelProperty ? _(model).resolveProperty(content) : content;
  },

  mixin: function(plugins) {
    // make a copy of options before any
    // plugins have been mixed in
    var options = _(this.options).clone();
    // loop through each plugin to mixin
    _(plugins).each(function(plugin) {
      // loop through each plugin key, val pair
      _(plugin).each(function(val, key) {
        if(_(val).isObject() && key === "options") {
          // extend the options hash
          _(val).each(function(option, name) {
            if((_(this.options[name]).exists() && _(option).exists()) ||
              !_(this.options[name]).exists()) {
                // only overwrite a key with a value, but it
                // will add a null value if key wasn't present before
                this.options[name] = option;
              }
          }, this);
        }
        else if(_(val).isFunction()) {
          // add plugin functions to the object
          this[key] = val;
        }
      }, this);
    }, this);
    // now extend options with original values
    _(this.options).extend(options);
  }
};

_(Backbone.View.prototype).extend(viewMixins);

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
  Backbone.$ = $;
}

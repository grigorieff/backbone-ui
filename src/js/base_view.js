var Backbone = require('backbone');
var _ = require('underscore');

// BaseView is a Backbone View extended with some methods/functionality
// common to the components in Backbone-UI.
//
module.exports = Backbone.View.extend({
  // Automatically attach options, as Backbone.View did
  // prior to version 1.1.0.
  initialize: function(options) {
    this.options = this.options ? _({}).extend(this.options, options) : options;
  },

  // Resolve the appropriate content from the given choices.
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
});

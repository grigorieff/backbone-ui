var _ = require('underscore');

var $ = require('./util');
var BaseView = require('./base_view');
var HasAlternativeProperty = require('./has_alternative_property');
var HasError = require('./has_error');
var HasFocus = require('./has_focus');
var HasFormLabel = require('./has_form_label');
var HasGlyph = require('./has_glyph');
var HasModel = require('./has_model');
var Menu = require('./menu');

module.exports = BaseView.extend({
  options: {
    // text to place in the pulldown button before a
    // selection has been made
    placeholder: 'Select...',

    // enables / disables the pulldown
    disabled: false,

    // A callback to invoke with a particular item when that item is
    // selected from the pulldown menu.
    onChange: $.noop
  },

  initialize: function(options) {
    BaseView.prototype.initialize.call(this, options);
    this.mixin([HasModel, HasAlternativeProperty, HasGlyph, HasFormLabel,
      HasError, HasFocus]);
    _(this).bindAll('render');

    this.$el.addClass('pulldown');
    if(this.options.name){
      this.$el.addClass(this.options.name);
    }
    if(!this.options.ignoreErrors) {
      this._observeErrors();
    }
  },

  render: function() {
    this.$el.empty();

    this._menu = new Menu({
      model: this.model,
      content: this.options.content,
      alternatives: this.options.alternatives,
      altLabelContent: this.options.altLabelContent,
      altValueContent: this.options.altValueContent,
      onChange: this.options.onChange,
      placeholder: this.options.placeholder,
      emptyItem: this.options.emptyItem,
      size: 1,
      disabled: this.options.disabled,
      ignoreErrors: true
    }).render();

    this._parent = $.el.div({className: 'pulldown_wrapper'});
    var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
    var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);
    this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, this._menu.el, this._parent);

    // add focusin / focusout
    this.setupFocus(this._menu.el, this._parent);

    this.el.appendChild(this.wrapWithFormLabel(this._parent));

    return this;
  },

  // sets the enabled state
  setEnabled: function(enabled) {
    this.options.disabled = !enabled;
    this._menu.setEnabled(enabled);
  }
});

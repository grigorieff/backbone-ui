var bean = require('bean');
var _ = require('underscore');

var $ = require('./util');
var BaseView = require('./base_view');
var HasModel = require('./has_model');
var HasGlyph = require('./has_glyph');

module.exports = BaseView.extend({
  options: {
    // disables the link (non-clickable)
    disabled: false,

    // A callback to invoke when the link is clicked
    onClick: null
  },

  tagName: 'a',

  initialize: function(options) {
    BaseView.prototype.initialize.call(this, options);
    this.mixin([HasModel, HasGlyph]);

    _(this).bindAll('render');

    this.$el.addClass('link');

    bean.on(this.el, 'click', _(function(e) {
      e.preventDefault();
      e.stopPropagation();
      if(!this.options.disabled && this.options.onClick) {
        this.options.onClick(e);
      }
    }).bind(this));

  },

  render: function() {
    var labelText = this.resolveContent();

    this._observeModel(this.render);

    this.$el.empty();

    var content = $.el.span(labelText);

    var glyphLeftClassName = this.resolveGlyph(this.model, this.options.glyphLeftClassName);
    var glyphRightClassName = this.resolveGlyph(this.model, this.options.glyphRightClassName);

    this.insertGlyphLayout(glyphLeftClassName, glyphRightClassName, content, this.el);

    // add appropriate class names
    this.setEnabled(!this.options.disabled);

    return this;
  },

  // sets the enabled state of the button
  setEnabled: function(enabled) {
    if(enabled) {
      this.el.href = '#';
    } else {
      delete this.el.href;
    }
    this.options.disabled = !enabled;
    this.$el.toggleClass('disabled', !enabled);
  }
});

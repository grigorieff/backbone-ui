// A mixin for dealing with focus in / focus out.

var bean = require('bean');

var $ = require('./util');

module.exports = {
  setupFocus: function(el, parent) {
    bean.on(el, {
      focusin: function() {
        $(parent).addClass('focused');
      },
      focusout: function() {
        $(parent).removeClass('focused');
      }
    });
  }
};

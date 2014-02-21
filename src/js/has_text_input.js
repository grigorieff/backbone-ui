// A mixin for dealing with a special input event.

var bean = require('bean');
var _ = require('underscore');

var ns = ".inputEvent ";
// A bunch of data strings that we use regularly
var dataBnd = "bound.inputEvent";
var dataVal = "value.inputEvent";

// Set up our list of events
var bindTo = [
    "input", "textInput",
    "propertychange",
    "paste", "cut",
    "keydown", "keyup",
    "drop",
""].join(ns);

// Events that fire before input value is updated
var delay = {
  paste: undefined,
  cut: undefined,
  keydown: undefined,
  drop: undefined,
  textInput: undefined
};

module.exports = {
  setupTextInput: function(callback) {
    var elem = this.input;

    this._inputEvent = {
      data: {},
      namespaces: "",
      timer: undefined,
      elem: elem,
      triggered: false
    };

    this._inputEvent.data.bndCount = this._inputEvent.data[dataBnd] || 0;

    var handler = function(e) {
      var elem = e.target;

      // Clear previous timers because we only need to know about 1 change
      clearTimeout(this._inputEvent.timer);
      this._inputEvent.timer = null;

      // Return if we've already triggered the event
      if(this._inputEvent.triggered) {
        return;
      }

      // paste, cut, keydown and drop all fire before the value is updated
      if(e.type in delay && !this._inputEvent.timer) {
        // ...so we need to delay them until after the event has fired
        this._inputEvent.timer = _(_(function() {
          if(elem.value !== this._inputEvent.data[dataVal]) {
            bean.fire(elem, 'txtinput');
            this._inputEvent.data[dataVal] = elem.value;
          }
        }).bind(this)).delay(0);
      }
      else if(e.type === "propertychange") {
        if (e.originalEvent.propertyName === "value") {
          bean.fire(elem, 'txtinput');
          this._inputEvent.data[dataVal] = elem.value;
          this._inputEvent.triggered = true;
          _(_(function() {
            this._inputEvent.triggered = false;
          }).bind(this)).delay(0);
        }
      }
      else {
        bean.fire(elem, 'txtinput');
        this._inputEvent.data[dataVal] = elem.value;
        this._inputEvent.triggered = true;
        _(_(function () {
          this._inputEvent.triggered = false;
        }).bind(this)).delay(0);
      }
    };

    if(!this._inputEvent.data.bndCount) {
      bean.on(this._inputEvent.elem, bindTo, _(handler).bind(this));
    }

    this._inputEvent.data[dataBnd] = ++this._inputEvent.data.bndCount;
    this._inputEvent.data[dataVal] = elem.value;

    bean.on(this._inputEvent.elem, 'txtinput', callback);

  }
};

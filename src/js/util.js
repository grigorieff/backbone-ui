(function() {
  
  var tagNames = {
    "<button>" : function() {
      return $.el.button();
    },
    "<div>" : function() {
      return $.el.div();
    }
  };
  
  // micro DOM utility library used as 
  // DOMSelectorLibrary for Backbone.$
  // plus some helper functions
  Backbone.UI.Util = function(obj) {
    if (obj instanceof Backbone.UI.Util) return obj;
    if (!(this instanceof Backbone.UI.Util)) return new Backbone.UI.Util(obj);
    // create an element if tagName
    this[0] = this._util = _(obj).isString() && _(tagNames).has(obj) ? tagNames[obj]() : obj;
  };
  
  Backbone.UI.Util.attr = function(el, options) {
    
    // if options is an object then we set each on el
    if(_(options).isObject()) {
      _(options).each(function(val, key) {
        el.setAttribute(key, val);
      });
    }
    
    return el;
    
  };
  
  Backbone.UI.Util.addClass = function(el, klass) {
    return Backbone.UI.Util.toggleClass(el, klass, true);
  };  
  
  Backbone.UI.Util.removeClass = function(el, klass) {
    return Backbone.UI.Util.toggleClass(el, klass, false);
  },
  
  Backbone.UI.Util.toggleClass = function(el, items, keepClass) {
    // an empty set of class names
    var klassName = {};
    // add each existing class name 
    // on the element to the set
    _(el.className.split(" ")).each(function(klass) {
      klassName[klass] = true;
    });
    // add each class name passed
    // in as a parameter to the set
    _(items.split(" ")).each(function(klass) {
      if(keepClass) {
        klassName[klass] = true;
      }
      else {
        delete klassName[klass];
      }
    });
    // set the className property on the element
    el.className = _(klassName).keys().join(" ");
    return el;
  };
  
  Backbone.UI.Util.empty = function(el) {
    while(el.lastChild) {
      el.removeChild(el.lastChild);
    }
    return;
  };
  
  Backbone.UI.Util.removeEl = function(el) {
    if(el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    return;
  };
  
  // Add each function to the prototype 
  _(_(Backbone.UI.Util).functions()).each(function(name) {
    var func = Backbone.UI.Util[name];
    Backbone.UI.Util.prototype[name] = function() {
      var args = [this._util];
      Array.prototype.push.apply(args, arguments);
      return func.apply(Backbone.UI.Util, args);
    };
  });
  
  // setup dom support for backbone.js
  Backbone.$ = Backbone.UI.Util;
  
  
}());
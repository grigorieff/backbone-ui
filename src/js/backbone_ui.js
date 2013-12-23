(function(context) {
  // ensure backbone
  if(typeof Backbone === 'undefined') alert('backbone environment not loaded') ;

  // define our Backbone.UI namespace
  Backbone.UI = Backbone.UI || {
    KEYS : {
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
    },

    setSkin : function(skin) {
      if(!!Backbone.UI.currentSkin) {
        _(document.body).removeClass('skin_' + Backbone.UI.currentSkin);
      }
      _(document.body).addClass('skin_' + skin);
      Backbone.UI.currentSkin = skin;
    },

    noop : function(){},

    // added a BaseView that implements options
    // as did Backbone.js pre version 1.0.1
    BaseView : Backbone.View.extend({
      initialize : function(options) {
        this.options = this.options ? _({}).extend(this.options, options) : options;
      }
    })  
  };

  _(Backbone.View.prototype).extend({
    
    // resolves the appropriate content from the given choices
    resolveContent : function(model, content, defaultOption) {
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

    mixin : function(plugins) {
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

  // Add some utility methods to underscore
  _.mixin({
    // produces a natural language description of the given
    // index in the given list
    nameForIndex : function(list, index) {
      return list.length === 1 ? 'first last' : 
        index === 0 ? 'first' : 
        index === list.length - 1 ? 
        'last' : 'middle';
    },

    exists : function(object) {
      return !_(object).isNull() && !_(object).isUndefined();
    },
    
    // resolves the value of the given property on the given 
    // object.
    resolveProperty : function(object, property) {
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
    setProperty : function(object, property, value, silent) {
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
          object.set(attributes, {silent : silent});
        }
        else {
          object[property] = value;
        }
      }
    },
    
    addClass : function(el, klass) {
      return _(el).toggleClass(klass, true);
    },
    
    removeClass : function(el, klass) {
      return _(el).toggleClass(klass, false);
    },
    
    toggleClass : function(el, items, keepClass) {
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
      return;
    },
    
    empty : function(el) {
      while(el.lastChild) {
        el.removeChild(el.lastChild);
      }
      return;
    },
    
    removeEl : function(el) {
      if(el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },
    
    offsetEl : function(el) {
      
      var box, boxModelSupport = (document.compatMode === "CSS1Compat");

      if(!el || !el.ownerDocument || el === el.ownerDocument.body) {
        return null;
      }

      try {
        box = el.getBoundingClientRect();
      } 
      catch(e) {}

      var doc = el.ownerDocument,
      docElem = doc.documentElement;

      // Make sure we're not dealing with a disconnected DOM node
      if (!box) {
        return box ? {top: box.top, left: box.left} : {top: 0, left: 0};
      }

      var body = doc.body,
      clientTop  = docElem.clientTop  || body.clientTop  || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      scrollTop  = (window.pageYOffset || boxModelSupport && docElem.scrollTop  || body.scrollTop ),
      scrollLeft = (window.pageXOffset || boxModelSupport && docElem.scrollLeft || body.scrollLeft),
      top  = box.top  + scrollTop  - clientTop,
      left = box.left + scrollLeft - clientLeft;

      return { top: top, left: left };
    },
    
    getStyle : function(elm, style) {
        var computedStyle;
        if (typeof elm.currentStyle != "undefined") {
            computedStyle = elm.currentStyle;
        }
        else {
            computedStyle = document.defaultView.getComputedStyle(elm, null);
        }
        return computedStyle[style];
    },
    
    // Hides each element the next time the user clicks the mouse or presses a
    // key.  This is a one-shot action - once the element is hidden, all
    // related event handlers are removed.
    autohide : function(context, options) {
      
      context = _(context).isArray() ? context : [context];
      
      _(context).each(function(el) {
        options = _.extend({
          onEvent : 'click', //click or mouseover
          leaveOpen : false,
          hideCallback : false,
          ignoreInputs: false,
          ignoreKeys : [],
          leaveOpenTargets : []
        }, options || {});

        el._autoignore = true;
        setTimeout(function() {
          el._autoignore = false; 
          delete el._autoignore;
        }, 0);

        if (!el._autohider) {
          el._autohider = _(function(e) {

            var target = e.target;
            if(el.style.display === "none") return;

            if (options.ignoreInputs && (/input|textarea|select|option/i).test(target.nodeName)) return;
            //if (el._autoignore || (options.leaveOpen && Element.partOf(e.target, el)))
            if(el._autoignore) return;
            // pass in a list of keys to ignore as autohide triggers
            if(e.type && e.type.match(/keypress/) && _.include(options.ignoreKeys, e.keyCode)) return;
            
            // allows you to provide an array of elements that should not trigger autohiding.
            // This is useful for doing things like a flyout menu from a pulldown
            if(options.leaveOpenTargets) {
              var ancestor = _(options.leaveOpenTargets).find(function(t) {
                var toReturn = false;
                if(e.target === t) {
                  toReturn = true;
                }
                else {
                  var currElement = e.target;
                  while(currElement.parentNode && !toReturn) {
                    currElement = currElement.parentNode;
                    if(currElement === t) {
                      toReturn = true;
                    }
                  }
                }
                return toReturn;
              });
              if(!!ancestor) return;
            }
            
            var proceed = (options.hideCallback) ? options.hideCallback(el) : true;
            if (!proceed) return;

            el.style.display = "none";
            bean.on(document, options.onEvent, el._autohider);
            bean.on(document, 'keypress', el._autohider);
            el._autohider = null;
          }).bind(context);

          bean.on(document, options.onEvent, el._autohider);
          bean.on(document, 'keypress', el._autohider);
        }
      });
    },
    
    // aligns each element releative to the given anchor
    /**
    * <p>
    * Align an element relative to another element (which can be absolute or
    * inline).  This forces the target element to be absolutely positioned
    * (which it probably should be anyway, to insure it's width/height don't
    * change when converting to absolute positioning.)</p>
    *
    * @function alignTo
    * @param {Element} anchor element to position relative to
    * @param pos A string consists of one or two words that describe where the
    * target element is positioned relative to the anchor element.
    * <dl>
    *   <dt>center</dt>
    *     <dd>The default alignment, centers the element along either the
    *     vertical or horizontal axis.</dd>
    *   <dt>top</dt>    
    *     <dd>places target element above the anchor</dd>
    *   <dt>bottom</dt> 
    *     <dd>places target element below the anchor</dd>
    *   <dt>left</dt>   
    *     <dd>places target element to the left of the anchor</dd>
    *   <dt>right</dt>  
    *     <dd>places target element to the right of the anchor</dd>
    *   <dt>-top</dt>   
    *     <dd>aligns top edge of target with top of anchor</dd>
    *   <dt>-bottom</dt>
    *     <dd>aligns bottom edge of target with bottom of anchor</dd>
    *   <dt>-left</dt>  
    *     <dd>aligns left edge of target with left of anchor</dd>
    *   <dt>-right</dt> 
    *     <dd>aligns right edge of target with right of anchor</dd>
    *   <dt>no-constraint</dt> 
    *     <dd>
    *      By default, the target is constrained to the viewport.
    *      This allows you to let it overflow the page.
    *     </dd>
    *   </dl>
    *
    * For example...
    * <ul>
    *   <li>"top" - element is above anchor, centered horizontally</li>
    *   <li>"bottom left" - element is placed below and to left of anchor</li>
    *   <li>"-left bottom" - element will be below anchor, aligned along left
    *   edge.</li>
    *   <li>(This is the recommended position for drop-down selection
    *   lists)</li>
    * </ul>
    * @param {int} xFudge Optional x offset to add (may be negative)
    * @param {int} yFudge Optional y offset to add (may be negative)
    */
    alignTo : function(context, anchor, pos, xFudge, yFudge, container) {
      
      context = _(context).isArray() ? context : [context];
      
      _(context).each(function(el) {
        var rehide = false;
        // in order for alignTo to work properly the element needs to be visible
        // if it's hidden show it off screen so it can be positioned
        if(el.style.display === 'none') {
          rehide=true;
          el.style.position = 'absolute';
          el.style.top = '-10000px';
          el.style.left = '-10000px';
          el.style.display = 'block';
        }

        var o = _alignCoords(el, anchor, pos, xFudge, yFudge);
        
        // if a container is passed in adjust position
        // for the offset of the containing element
        if(_(container).isElement()) {
          var c = _(container).offsetEl();
          o.x = o.x - c.left;
          o.y = o.y - c.top;
        }
        
        el.style.position = 'absolute';
        el.style.left = Math.round(o.x) + 'px';
        el.style.top = Math.round(o.y) + 'px';

        if(rehide) el.style.display = "none";
      });
    }
    
  });

  var _alignCoords = function(el, anchor, pos, xFudge, yFudge) {
    el = el;
    anchor = anchor;
    pos = pos || '';

    // Get anchor bounds (document relative)
    var bOffset = _(anchor).offsetEl();
    var bDim = {width : anchor.clientWidth, height : anchor.clientHeight};

    // Get element dimensions
    var elbDim = {width : el.clientWidth, height : el.clientHeight};

    // Determine align coords (document-relative)
    var x,y;
    if (pos.indexOf('-left') >= 0) {
      x = bOffset.left.x;
    } else if (pos.indexOf('left') >= 0) {
      x = bOffset.left - elbDim.width;
    } else if (pos.indexOf('-right') >= 0) {
      x = (bOffset.left + bDim.width) - elbDim.width;
    } else if (pos.indexOf('right') >= 0) {
      x = bOffset.left + bDim.width;
    } else { // Default = centered
      x = bOffset.left + (bDim.width - elbDim.width)/2;
    }

    if (pos.indexOf('-top') >= 0) {
      y = bOffset.top;
    } else if (pos.indexOf('top') >= 0) {
      y = bOffset.top - elbDim.height;
    } else if (pos.indexOf('-bottom') >= 0) {
      y = (bOffset.top + bDim.height) - elbDim.height;
    } else if (pos.indexOf('bottom') >= 0) {
      y = bOffset.top + bDim.height;
    } else { // Default = centered
      y = bOffset.top + (bDim.height - elbDim.height)/2;
    }
    
    // Check for constrainment (default true)
    var constraint = true;
    if (pos.indexOf('no-constraint') >= 0) constraint = false;

    // Add fudge factors
    x += xFudge || 0;
    y += yFudge || 0;

    // Return rect, constrained to viewport
    return {x : x, y : y};
  };
  
}(this));

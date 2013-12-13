// A mixin for dealing with a special input event
(function(udf){
  
  var ns = ".inputEvent ",
      // A bunch of data strings that we use regularly
      dataBnd = "bound.inputEvent",
      dataVal = "value.inputEvent",
      dataDlg = "delegated.inputEvent",
      // Set up our list of events
      bindTo = [
          "input", "textInput",
          "propertychange",
          "paste", "cut",
          "keydown", "keyup",
          "drop",
      ""].join(ns),
      // Events required for delegate, mostly for IE support
      dlgtTo = [ "focusin", "mouseover", "dragstart", "" ].join(ns),
      // Elements supporting text input, not including contentEditable
      supported = {TEXTAREA:udf, INPUT:udf},
      // Events that fire before input value is updated
      delay = { paste:udf, cut:udf, keydown:udf, drop:udf, textInput:udf };
  
  Backbone.UI.HasTextInput = {
    
    setupTextInput : function(callback) {
      
      var elem = this.input;
      
      this._inputEvent = { 
        data : null,
        namespaces : "",
        timer : undefined,
        elem : elem,
        // Ge references to the element
        $elem : $(elem),
        triggered : false,
        bndCount : $.data(elem, dataBnd) || 0
      };
      
      if(!this._inputEvent.bndCount) {
        bean.on(this._inputEvent.elem, bindTo, _(handler).bind(this));
      }
      
      $.data(this._inputEvent.elem, dataBnd, ++this._inputEvent.bndCount);
      $.data(this._inputEvent.elem, dataVal, elem.value);
      
      
      function handler(e) {
        var elem = e.target;

        // Clear previous timers because we only need to know about 1 change
        window.clearTimeout(this._inputEvent.timer), this._inputEvent.timer = null;

        // Return if we've already triggered the event
        if(this._inputEvent.triggered) {
          return;
        }

        // paste, cut, keydown and drop all fire before the value is updated
        if(e.type in delay && !this._inputEvent.timer) {
          // ...so we need to delay them until after the event has fired
          this._inputEvent.timer = window.setTimeout(function() {
            if(elem.value !== $.data(elem, dataVal)) {
              bean.fire(elem, 'txtinput');
              $.data(elem, dataVal, elem.value);
            }
          }, 0);
        }
        else if(e.type == "propertychange") {
          if (e.originalEvent.propertyName == "value") {
            bean.fire(elem, 'txtinput');
            $.data(elem, dataVal, elem.value);
            this._inputEvent.triggered = true;
            window.setTimeout(_(function () {
              this._inputEvent.triggered = false;
            }).bind(this), 0);
          }
        }
        else {
          bean.fire(elem, 'txtinput');
          $.data(elem, dataVal, elem.value);
          this._inputEvent.triggered = true;
          window.setTimeout(_(function () {
            this._inputEvent.triggered = false;
          }).bind(this), 0);
        }
      }
      
      bean.on(this._inputEvent.elem, 'txtinput', callback);
      
    }    
        
  };
}());

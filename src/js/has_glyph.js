// A mixin for dealing with glyphs in widgets 
(function(){

  var loadGlyph = function(name, size, bgSize){
    var div = $.el.span({
      className : 'glyph'
    });
    $(div).css({
      background : name,
      width : size + 'px',
      height : size + 'px',
      backgroundSize : bgSize
    });
    return div;
  };

  Backbone.UI.HasGlyph = {

    options : {
      // The pixel size of the width and height of a glyph
      glyphSize : 26,
      // The padding between the glyph and the rest of the content
      glyphPadding : 3,
      // The background-size of the glyph
      glyphBackgroundSize : 'auto'
    },
    
    insertGlyphLayout : function(glyphCss, glyphRightCss, content, parent) {

      // append left glyph
      if(glyphCss) {
        var glyphLeft = loadGlyph(glyphCss, this.options.glyphSize, this.options.glyphBackgroundSize);
        $(glyphLeft).addClass('left');
        $(glyphLeft).css({
          marginRight : this.options.glyphPadding + 'px'
        });
        parent.appendChild(glyphLeft);
      }
      
      // append content
      if(content) {
        parent.appendChild(content);
      }
      
      // append right glyph
      if(glyphRightCss) {
        var glyphRight = loadGlyph(glyphRightCss, this.options.glyphSize, this.options.glyphBackgroundSize);
        $(glyphRight).addClass('right');
        $(glyphRight).css({
          marginLeft : this.options.glyphPadding + 'px'
        });
        parent.appendChild(glyphRight);
      }
     
    },

    resolveGlyph : function(model, content) {
      if(content === null) return null;
      var glyph = null;
      if(_(model).exists() && _((model.attributes || model)[content]).exists()) {
        glyph = this.resolveContent(model, content);
      }
      return _(glyph).exists() ? glyph : content;
    }
  };
}());

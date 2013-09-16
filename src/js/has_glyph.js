// A mixin for dealing with glyphs in widgets 
(function(){

  var loadGlyph = function(name, size){
    var div = $.el.span({
      className : 'glyph'
    });
    $(div).css({
      background : name,
      width : size + 'px',
      height : size + 'px'
    });
    return div;
  };

  Backbone.UI.HasGlyph = {
    GLYPH_PADDING : 3,

    options : {
      // The pixel size of the width and height of a glyph
      glyphSize : 26
    },
    
    insertGlyphLayout : function(glyphCss, glyphRightCss, content, parent) {

      // append left glyph
      if(glyphCss) {
        var glyphLeft = loadGlyph(glyphCss, this.options.glyphSize);
        $(glyphLeft).css({
          paddingRight : Backbone.UI.HasGlyph.GLYPH_PADDING + 'px'
        });
        parent.appendChild(glyphLeft);
      }
      
      // append content
      if(content) {
        parent.appendChild(content);
      }
      
      // append right glyph
      if(glyphRightCss) {
        var glyphRight = loadGlyph(glyphRightCss, this.options.glyphSize);
        $(glyphRight).css({
          paddingLeft : Backbone.UI.HasGlyph.GLYPH_PADDING + 'px'
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

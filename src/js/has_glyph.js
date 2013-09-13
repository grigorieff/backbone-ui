// A mixin for dealing with glyphs in widgets 
(function(){

  var loadGlyph = function(name, size){
    var div = $.el.div({
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
    
    insertGlyphLayout : function(glyphCss, glyphRightCss, parent) {

      var contentContainer = $.el.div({'className' : 'content'});
      if(!glyphCss && !glyphRightCss) {
        contentContainer.appendTo(parent);
        return contentContainer;
      }

      var wrapper = $.el.div({className : 'glyph_wrapper'});
      wrapper.appendTo(parent);

      var padding = this.options.glyphSize + Backbone.UI.HasGlyph.GLYPH_PADDING;

      if(glyphRightCss) {
        var glyphRight = loadGlyph(glyphRightCss, this.options.glyphSize);
        $(glyphRight).addClass('right');
        glyphRight.appendTo(wrapper);
        $(wrapper).addClass('has_glyph_right');
        $(contentContainer).css({
          marginRight : padding + 'px'
        });
      }

      if(glyphCss) {
        var glyphLeft = loadGlyph(glyphCss, this.options.glyphSize);
        glyphLeft.appendTo(wrapper);
        $(glyphLeft).addClass('left');
        $(wrapper).addClass('has_glyph');
        $(contentContainer).css({
          marginLeft : padding + 'px'
        });
      }

      contentContainer.appendTo(wrapper);

      return contentContainer;
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

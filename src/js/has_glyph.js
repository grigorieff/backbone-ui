// A mixin for dealing with glyphs in widgets 
(function(){
  
  var loadGlyph = function(name){
    
    var className = 'glyph';
    if(name.length === 1) {
      var span = $.el.span({
        className : className,
        style : 'margin: 0 8px 0 0'
      }, name);
      return span;
    }
    else {
      var image = new Image();
      $(image).hide();
      image.onload = function() {
        // center the image inside a 28px square
        var topOffset = Math.max(1, ((28 - image.height) / 2));
        var leftOffset = Math.max(3, ((28 - image.width) / 2));

        $(image).css({
          border : 'none'
        });
        $(image).show();
      };

      image.src = name.match(/(http:\/\/)|(https:\/\/)/) ? name : 
        Backbone.UI.GLYPH_DIR + '/' + name + (name.indexOf('.') > 0 ? '' : '.png');

      image.className = className;
      return image;
    }
  };
  
  
  Backbone.UI.HasGlyph = {
    GLYPH_SIZE : 22,

    options : {

      // a glyph to show to the left
      glyph : null,
      // a glyph to show to the right
      glyphRight : null
    
    },
    
    insertGlyphLayout : function(glyph, glyphRight, parent) {
      
      var contentWrapper, leftWrapper, rightWrapper;
      rightWrapper = $.el.div({className : 'glyph_right_wrapper'},
        leftWrapper = $.el.div({className : 'glyph_left_wrapper'},
          contentWrapper = $.el.div({className : 'glyph_content_wrapper'})
        )).appendTo(parent);
        
      if(glyph) {
        $(parent).addClass('has_glyph');
        leftWrapper.insertBefore(loadGlyph(glyph), contentWrapper);
      }
      
      else if(glyphRight) {
      $(parent).addClass('has_glyph_right');
        rightWrapper.appendChild(loadGlyph(glyphRight));        
      }
      
      return contentWrapper;
    }

  };
}());

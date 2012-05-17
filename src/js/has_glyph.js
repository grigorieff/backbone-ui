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
        $(image).css('display','inline-block');
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

      var contentWrapper = $.el.div({className : 'glyph_content_wrapper'});
      var rightWrapper = glyphRight ? $.el.div({className : 'glyph_right_wrapper'}) : null;
      var leftWrapper = glyph ? $.el.div({className : 'glyph_left_wrapper'}, contentWrapper) : null;

      if(rightWrapper) {
        var contentParent = leftWrapper ? leftWrapper : rightWrapper;
        contentWrapper.appendTo(contentParent);
        if(leftWrapper) leftWrapper.appendTo(rightWrapper);
        rightWrapper.appendTo(parent);
        rightWrapper.appendChild(loadGlyph(glyphRight));        
      }

      else if(leftWrapper) {
        leftWrapper.appendTo(parent);
        $(parent).addClass('has_glyph');
        leftWrapper.insertBefore(loadGlyph(glyph), contentWrapper);
      }

      else {
        contentWrapper.appendTo(parent);
        $(parent).addClass('has_glyph_right');
      }
      
      return contentWrapper;
    }

  };
}());

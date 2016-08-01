function Photo(src, caption, link, styles){
  Obj.apply(this);
  this.defMember("src");
  this.defMember("caption");
  this.defMember("link");
  this.defMember("styles", {
    width: "100%"
  }, function(newStyles){
    return $.extend({}, this._styles, newStyles);
  });
  this.renderer = function(){
    if(this.link){
      var $photo = $("<a href='"+this.link+"' class='photo'></a>");
    } else {
      var $photo = $("<div class='photo'></div>");
    }
    var styles = $.extend({}, this.styles, {
      backgroundImage: "url("+this.src+")"
    });
    $photo.css(styles);
    if(this.caption){
      $photo.append("<div class='photo-caption'>"+this.caption+"</div>");
    }
    return $photo;
  };
  this.refresher = function($element, changed){
    if(changed == "src"){
      $element.css("background-image", "url("+this.src+")");
    } else if(changed == "caption"){
      var $caption = $element.find(".photo-caption");
      if($caption.length){
        if(this.caption)
          $caption.html(this.caption);
        else
          $caption.remove();
      } else {
        $photo.append("<div class='photo-caption'>"+this.caption+"</div>");
      }
    } else if(
      changed == "link" && // The link has changed
      $el[0].tagName == "A" && // It had a link before
      this.link // It is still has a link
    ){
      $el.href = this.link;
    } else return this.renderer.call(this);
  }
  this.init = function(src, caption, link, styles){
    if(src)
      this.src = src;
    if(caption)
      this.caption = caption;
    if(link)
      this.link = link;
  };
  this.init.apply(this);
};
Photo.prototype = Object.create(Obj.prototype);

function Flipper(src, title, details, settings){
  Obj.apply(this);
  this.defMember("src");
  this.defMember("title");
  this.defMember("details");
  this.defSettings({
    click: false,
    link: false,
    width: 320,
    height: 480
  });
  this.renderer = function(){
    var $container = (this.settings.link)?
      $("<a href='"+this.settings.link+"' class='Flipper-container'></a>"):
      $("<div class='Flipper-container'></div>");
    var $flipper = $("<div class='Flipper'></div>").appendTo($container);
    var $front = $("<div class='Flipper-front' style='background-image: url("+this.src+")'><div class='Flipper-title'>"+this.title+"</div></div>").appendTo($flipper);
    var $back = $("<div class='Flipper-back'><div class='Flipper-title'>"+this.title+"</div><div class='Flipper-details'>"+this.details+"</div></div>").appendTo($flipper);
    $container.add($flipper).add($front).add($back).height(this.settings.height).width(this.settings.width);
    if(this.settings.click){
      $container.on("click", function(){
        $container.toggleClass("Flipper-flipped");
      });
    }
    return $container;
  };
  this.init = function(src, title, details, settings){
    this.src = src;
    this.title = title;
    this.details = details;
    this.settings = settings;
  };
  this.init.apply(arguments);
};
Flipper.prototype = Object.create(Obj.prototype);

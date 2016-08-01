function FooBarSettings(settings){
  Obj.apply(this);
  this.defSettings({
    foo: "bar"
  });
  
  this.renderer = function(){
    var $fooBar = $("<div class='FooBar'></div>");
    for(var k in this.settings){
      $("<div class='FooBar-setting'>"+k+":"+this.settings[k]+"</div>").appendTo($fooBar);
    }
    return $fooBar;
  };
  
  this.init = function(settings){
    if(settings)
      this.settings = settings;
  };
  this.init.apply(this, arguments);
};
FooBarSettings.prototype = Object.create(Obj.prototype);

function Button(label, action){
  Obj.apply(this);
  this.defMember("label", "Button");
  this.defMethod("action", function(){return this});
  this.defMethod("fromObject", function(o){
    if(o.label)
      this.label = o.label;
    if(o.action)
      this.action = o.action;
    return this;
  });
  this.defMethod("toObject", function(){
    return {
      src: this._src,
      action: this._action
    };
  });
  this.renderer = function(){
    var self = this;
    return $("<button>"+this.label+"</button>").on("click", function(){
      self.action.call(self);
    });
  };
  this.refresher = function($element, change){
    if(change == "label"){
      $element.html(this.label);
    } else if(change == "action"){
      // Do Nothing
    } else {  // Unknown change
      return this.renderer.call(this); // Re-render
    }
  }
  this.init = function(label, action){
    if(label)
      this.label = label;
    if(action)
      this.defMethod("action", action);
  };
  this.init.apply(this, arguments);
}
Button.prototype = Object.create(Obj.prototype);

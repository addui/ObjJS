function Obj(){
  this._parent = null;
  this._handlers = [];
  this._onceHandlers = [];
  this._elements = $();
  this.on = function(events, handler){
    if(typeof(events) == "function" && handler === undefined){
      handler = events;
      events = "all";
    }
    events = events.toLowerCase().split(" ");
    for(var i=0;i<events.length;i++){
      this._handlers.push({
        event: events[i],
        handler: handler
      });
    }
    return this;
  };
  this.once = function(events, handler){
    if(typeof(events) == "function" && handler === undefined){
      handler = events;
      events = "all";
    }
    events = events.toLowerCase().split(" ");
    for(var i=0;i<events.length;i++){
      this._onceHandlers.push({
        event: events[i],
        handler: handler
      });
    }
    return this;
  };
  this.off = function(events, handler){
    if(handler === undefined && typeof(events) == "function"){
      // Handler only
      var handler = events;
      for(var i=0;i<this._handlers.length;i++){
        if(this._handlers[i].handler == handler){
          this._handlers.splice(i--, 1);
        }
      }
    } else if(handler === undefined && typeof(events) == "string"){
      // Events only
      events = events.toLowerCase().split(" ");
      for(var i=0;i<this._handlers.length;i++){
        if(events.indexOf(this._handlers[i].event) > -1){
          this._handlers.splice(i--, 1);
        }
      }
    } else {
      // Both Events and Hanlder
      events = events.toLowerCase().split(" ");
      for(var i=0;i<this._handlers.length;i++){
        if(
          events.indexOf(this._handlers[i].event) > -1 &&
          this._handlers[i].handler == handler
        ){
          this._handlers.splice(i--, 1);
        }
      }
    }
    return this;
  };
  this.offOnce = function(events, handler){
    if(handler === undefined && typeof(events) == "function"){
      // Handler only
      var handler = events;
      for(var i=0;i<this._onceHandlers.length;i++){
        if(this._onceHandlers[i].handler == handler){
          this._onceHandlers.splice(i--, 1);
        }
      }
    } else if(handler === undefined && typeof(events) == "string"){
      // Events only
      events = events.toLowerCase().split(" ");
      for(var i=0;i<this._onceHandlers.length;i++){
        if(events.indexOf(this._onceHandlers[i].event) > -1){
          this._onceHandlers.splice(i--, 1);
        }
      }
    } else {
      // Both Events and Hanlder
      events = events.toLowerCase().split(" ");
      for(var i=0;i<this._onceHandlers.length;i++){
        if(
          events.indexOf(this._onceHandlers[i].event) > -1 &&
          this._onceHandlers[i].handler == handler
        ){
          this._onceHandlers.splice(i--, 1);
        }
      }
    }
    return this;
  };
  this.trigger = function(events, data){
    events = events.toLowerCase().split(" ");
    /* On */
    for(var i=0;i<this._handlers.length;i++){
      if(
        events.indexOf(this._handlers[i].event) > -1 ||
        this._handlers[i].event == "all"
      ){
        this._handlers[i].handler.call(this, this._handlers[i].event, data);
      }
    }
    /* Once */
    for(var i=0;i<this._onceHandlers.length;i++){
      if(
        events.indexOf(this._onceHandlers[i].event) > -1 ||
        this._handlers[i].event == "all"
      ){
        this._onceHandlers[i].handler.call(this, this._onceHandlers[i].event, data);
        this._onceHandlers.splice(i--, 1); // Remove
      }
    }
//    if(events.indexOf("change") > -1){
//      this.refresh();
//    }
    return this;
  };
  this.subscribe = function(O){
    if(O.listener != undefined && typeof(O.listener) == "function")
      this.on("all", O.listener);
    return this;
  };
  this.ubsubscribe = function(O){
    if(O.listener != undefined && typeof(O.listener) == "function")
      this.off("all", O.listener);
    return this;
  };
  this.publish = function(events, data){
    return this.trigger(events, data);
  };
  this.renderer = function(){
    return $("<div class='Obj'></div>");
  };
  this.refresher = function(element){
    return this.renderer.apply(this);
  };
  this.destroyer = function(element){};
  this.render = function(selector, option){
    var self = this;
    if(selector === undefined)var selector = "body";
    if(option === undefined)var option = "replace";
    else option = option.toLowerCase();
    var extra = [].slice.call(arguments, 2);
    var returned  = this;
    $(selector).each(function(index, target){
      target = $(target);
      var El = self.renderer.apply(self, extra);
      self._elements = self._elements.add( El );
      
      if(option == "append"){
        target.append(El);
      } else if(option == "prepend"){
        target.prepend(El);
      } else if(option == "after"){
        target.after(El);
      } else if(option == "before"){
        target.before(El);
      } else if(option == "return"){
        returned = El;
      } else if(option == "none"){
      } else { // replace
        target.after(El);
        target.remove();
      }
    });
    this.trigger("render");
    return returned;
  };
  this.refresh = function(){
    var newElements = $();
    for(var i=0;i<this._elements.length;i++){
      var oldElement = this._elements.eq(i);
      var newElement = this.refresher.call(this, oldElement);
      if(newElement){
        oldElement.after(newElement);
        oldElement.remove();
        newElements = newElements.add(newElement);
      } else {
        newElements = newElements.add(oldElement);
      }
    }
    this._elements = newElements;
    return this;
  };
  this.destroy = function(){
    var self = this;
    this._elements.each(function(i,el){
      el = $(el);
      self.destroyer.apply(self, el);
    });
    this._elements.remove();
    this._elements = $();
    return this;
  };
};
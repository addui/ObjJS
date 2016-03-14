function extend(Child, Parent){
  Child.prototype = new Parent();
  Child.prototype.constructor = Child;
};
var Obj = function(){
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
        events.indexOf("all") > -1
      ){
        this._handlers[i].handler.call(this, this._handlers[i].event, data);
      }
    }
    /* Once */
    for(var i=0;i<this._onceHandlers.length;i++){
      if(
        events.indexOf(this._onceHandlers[i].event) > -1 ||
        events.indexOf("all") > -1
      ){
        this._onceHandlers[i].handler.call(this, this._onceHandlers[i].event, data);
        this._onceHandlers.splice(i--, 1); // Remove
      }
    }
    if(events.indexOf("change") > -1){
      this.refresh();
    }
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
    return this.renderer();
  };
  this.destroyer = function(element){};
  this.render = function(parents){
    var self = this;
    $(parents).each(function(index, parent){
      parent = $(parent);
      var El = self.renderer.call(this);
      self._elements = self._elements.add( El );
      parent.append(El);
    });
    return this;
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
      self.destroyer(el);
    });
    this._elements.remove();
    return this;
  };
};

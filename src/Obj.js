/**
* @author Dustin Poissant
* @version 1.6.1
**/
var GUIDList = [];
function generateGUID(){
  do {
    var GUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  } while(GUIDList.indexOf(GUID)>-1);
  return GUID;
};
function toFunc(n){if("function"==typeof n)return n;if("string"==typeof n){if(void 0!=window[n]&&"function"==typeof window[n])return window[n];try{return new Function(n)}catch(t){}}return function(){return n}}
var Objs = {};
function Obj(){
  this._parent = null;
  this._handlers = [];
  this._onceHandlers = [];
  this._elements = $();
  this.guid = generateGUID();
  this.defProp = function(name, value, setter, getter){
    if(["parent", "handlers", "onceHandlers", "elements", "guid", "defProp", "on", "once", "off", "offOnce", "trigger", "renderer", "render", "refresher", "destroyer", "render", "refresh", "destroy", "defSettings"].indexOf(name) > -1) return this;
    if(value===undefined)
      var value = null;
    if(!setter){
      var setter = function(newVal){
        this["_"+name] = newVal;
        this.trigger("set"+name+" "+name, newVal);
        this.refresh(name);
      }
    }
    if(!getter){
      var getter = function(){
        this.trigger("get"+name+" "+name, this["_"+name]);
        return this["_"+name];
      }
    }
    this["_"+name] = value;
    Object.defineProperty(this, name, {
      get: getter,
      set: setter
    });
    this.refresh(name);
    return this;
  };
  this.defSettings = function(settings){
    if(settings === undefined)
      var settings = {};
    return this.defProp("settings", settings, function(newSettings){
      this._settings = $.extend(this._settings, newSettings);
      this.trigger("setsettings settings", this._settings);
      this.refresh("settings");
    })
  };
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
        toFunc(this._handlers[i].handler).call(this, this._handlers[i].event, data);
      }
    }
    /* Once */
    for(var i=0;i<this._onceHandlers.length;i++){
      if(
        events.indexOf(this._onceHandlers[i].event) > -1 ||
        this._handlers[i].event == "all"
      ){
        toFunc(this._onceHandlers[i].handler).call(this, this._onceHandlers[i].event, data);
        this._onceHandlers.splice(i--, 1); // Remove
      }
    }
    return this;
  };
  this.renderer = function(){
    var $o = $("<div class='Obj'></div>");
    for(var k in this){
      if(
        k.indexOf("_") == 0 &&
        ["_parent", "_handlers", "_onceHandlers", "_elements"].indexOf(k) == -1
      ){
        $o.append("<div class='Obj-prop'><div class='Obj-prop-key'>"+(k.substr(1))+"</div><div class='Obj-prop-value'>"+this[k]+"</div></div>");
      }
    }
    return $o;
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
      var $el = $(self.renderer.apply(self, extra));
      $el.attr("guid", self.guid);
      self._elements = self._elements.add( $el );
      if(option == "append"){
        target.append($el);
      } else if(option == "prepend"){
        target.prepend($el);
      } else if(option == "after"){
        target.after($el);
      } else if(option == "before"){
        target.before($el);
      } else if(option == "return"){
        returned = $el;
      } else if(option == "none"){
      } else { // replace
        target.after($el);
        target.remove();
      }
    });
    this.trigger("render");
    return returned;
  };
  this.refresh = function(data){
    var newElements = $();
    for(var i=0;i<this._elements.length;i++){
      var oldElement = this._elements.eq(i);
        var newElement = this.refresher.call(this, oldElement, data);
      if(newElement){
        newElement.attr("guid", this.guid);
        this._elements = this._elements.not(oldElement);
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
      var $el = $(el);
      self.destroyer.call(self, $el);
    });
    this._elements.remove();
    this._elements = $();
    delete Objs[this.guid];
    return this;
  };
  Objs[this.guid] = this;
};

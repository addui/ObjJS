/**
* @author Dustin Poissant
* @version 2.0.0
**/
var Obj;
var Objs = {};
(function(){
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
  Obj = function(){
    this.guid = generateGUID();

    /*
    * Event Driven Members / Methods
    */
    this._handlers = [];
    this.on = function(event, handler, max_count){
      var e = "all";
      var h = null;
      var c = 0;
      for(var i=0; i<arguments.length; i++){
        if(typeof(arguments[i]) == "string"){
          e = arguments[i].toLowerCase().split(" ");
        } else if(arguments[i] instanceof Array){
          e = $.map(arguments[i], function(item, index){
            return item.toLowerCase();
          });
        } else if(typeof(arguments[i]) == "function"){
          h = arguments[i];
        } else if(typeof(arguments[i]) == "number"){
          c = arguments[i];
        }
      }
      if(!h) return this;
      for(var i=0;i<e.length;i++){
        this._handlers.push({
          event: e[i],
          handler: h,
          max_count: c,
          trigger_count: 0
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
    this.trigger = function(events, data){
      events = events.toLowerCase().split(" ");
      for(var i=0;i<this._handlers.length;i++){
        if(
          events.indexOf(this._handlers[i].event) > -1 ||
          this._handlers[i].event == "all"
        ){
          toFunc(this._handlers[i].handler).call(this, this._handlers[i].event, data);
        }
      }
      return this;
    };

    /*
    * Reative Members / Methods
    */
    this._elements = $();
    this.renderer = function(){
      var $o = $("<div class='Obj'></div>");
      for(var k in this){
        if(
          k.indexOf("_") == 0 &&
          ["_handlers", "_elements"].indexOf(k) == -1
        ){
          $o.append("<div class='Obj-member'><div class='Obj-member-key'>"+(k.substr(1))+"</div><div class='Obj-member-value'>"+this[k]+"</div></div>");
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
      if(option === undefined)var option = "append";
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
        } else if(option == "replace"){
          target.after($el);
          target.remove();
        } // else "none"
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

    /*
    * Defining Custom Members / Methods
    */
    this.defMember = function(name, value, setter, getter){
      var self = this;
      var disallowed = ["handlers", "on", "off", "trigger", "elements", "render", "renderer", "refresh", "refresher", "destroy", "destroyer", "defMember", "defSettings", "defMethod", "guid"];
      for(var i=0; i<disallowed; i++){
        if(
          disallowed[i] == name ||
          "_"+disallowed[i] == name
        ) return false;
      }
      this["_"+name] = (value===undefined)?null:value;
      Object.defineProperty(this, name, {
        get: function(){
          var val = this["_"+name];
          if(getter)
            val = getter(val);
          this.trigger("get"+name+" "+name, val);
          return val;
        },
        set: function(newVal){
          if(setter){
            var setterVal = setter(newVal);
            if(setterVal !== undefined)
              newVal = setterVal;
          }
          this["_"+name] = newVal;
          this.trigger("set"+name+" "+name, newVal);
          this.refresh(name);
        }
      })
    };
    this.defSettings = function(settings){
      if(settings === undefined)
        var settings = {};
      this._settings = settings;
      Object.defineProperty(this, "settings", {
        get: function(){
          this.trigger("getsettings settings", this._settings);
          return this._settings;
        },
        set: function(newSettings){
          this._settings = $.extend(this._settings, newSettings);
          this.trigger("setsettings settings", this._settings);
          this.refresh("settings");
        }
      });
    };
    this.defMethod = function(name, handler){
      var self = this;
      this["_"+name] = handler;
      this[name] = function(){
        var returned = self["_"+name].call(self, arguments);
        self.trigger(name, arguments);
        return returned;
      };
    };

    Objs[this.guid] = this;
  };
})();



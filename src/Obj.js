var GUID=function(){function e(){do var t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,r="x"==e?t:3&t|8;return r.toString(16)});while(!e.register(t));return t}return e.create=function(){return e()},e.version="1.2.0",e.list=[],e.exists=function(t){return e.list.indexOf(t)>-1},e.register=function(t){return e.exists(t)?!1:(e.list.push(t),!0)},e}();
var Obj = (function(){
  function toFunc(n){if("function"==typeof n)return n;if("string"==typeof n){if(void 0!=window[n]&&"function"==typeof window[n])return window[n];try{return new Function(n)}catch(t){}}return function(){return n}}

  /*
  * Obj base prototype
  */
  function Obj(){
    this._guid = GUID();
    Object.defineProperty(this, "guid", {
      get: function(){
        return this._guid;
      },
      set: function(){} // READ ONLY
    });

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
        if(!this._handlers[e[i]]){
          this._handlers[e[i]] = [];
        }
        this._handlers[e[i]].push({
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
        handler = events;
        for(var event in this._handlers){
          var handlers = this._handlers[event];
          for(var h=0; h<handlers.length; h++){
            if(handler == handlers[h].handler){
              this._handlers[event].splice(h--, 1);
            }
          }
          if(this._handlers[event].length == 0){
            delete this._handlers[event];
          }
        }
      } else if(handler === undefined && typeof(events) == "string"){
        // Events only
        events = events.toLowerCase().split(" ");
        for(var e=0; e<events.length; e++){
          delete this._handlers[events[e]];
        }
      } else {
        // Both Events and Hanlder
        events = events.toLowerCase().split(" ");
        for(var e=0; e<events.length; e++){
          var event = events[e];
          var handlers = this._handlers[event];
          for(var h=0; h<handlers.length; h++){
            if(handlers[h].handler == handler){
              handlers.splice(h--, 1);
            }
          }
          if(this._handlers[event].length == 0){
            delete this._handlers[event];
          }
        }
      }
      return this;
    };
    this.trigger = function(events, data){
      events = events.toLowerCase().split(" ");
      for(var e=0; e<events.length; e++){
        var event = events[e];
        if(this._handlers[event]){
          for(var h=0; h<this._handlers[event].length; h++){
            var handler = this._handlers[event][h];
            toFunc(handler.handler).call(this, event, data);
            handler.trigger_count++;
            if(handler.max_count && handler.max_coung < handler.trigger_count){
              this._Handlers[event].splice(h--, 1);
            }
          }
        }
      }
      return this;
    };

    /*
    * Reative Members / Methods
    */
    this._elements = $();
    this.pauseRefreshing = false;
    this.renderer = function(){
      var $o = $("<div class='Obj'></div>");
      for(var k in this){
        if(
          k.indexOf("_") == 0 &&
          typeof(this[k]) != "function" &&
          ["_handlers", "_elements", "_guid"].indexOf(k) == -1
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
    this.cleaner = function(){};
    this.render = function(selector, option){
      var self = this;
      if(selector === undefined || selector == "")var selector = "body";
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
      if(this.pauseRefreshing) return this;
      var newElements = $();
      for(var i=0; i<this._elements.length; i++){
        var oldElement = this._elements.eq(i);
        var newElement = this.refresher.call(this, oldElement, data);
        if(newElement){
          newElement.attr("guid", this.guid);
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
        $el.off();
        $el.find("*").off();
        self.destroyer.call(self, $el);
      });
      this._elements.remove();
      this._elements = $();
      delete Obj.directory[this._guid];
      delete GUID.list[this._guid];
      return this;
    };
    this.clean = function(){
      var $all = $("body *");
      for(var i=0; i<this._elements.length; i++){
        if($all.filter(this._elements[i]).length == 0){
          this._elements = this._elements.not(this._elements.eq(i));
        }
      }
      this.cleaner();
      this.trigger("clean");
      return this;
    };

    /*
    * Defining Custom Members / Methods
    */
    this.defMember = function(name, value, setter, getter){
      var self = this;
      var disallowed = ["handlers", "on", "off", "trigger", "elements", "render", "refresh", "destroy", "defMember", "defSettings", "defMethod", "guid", "clean"];
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
            val = getter.call(self, val);
          return val;
        },
        set: function(newVal){
          if(setter){
            var setterVal = setter.call(self, newVal);
            if(setterVal !== undefined)
              newVal = setterVal;
          }
          this["_"+name] = newVal;
          this.refresh(name);
          this.trigger(name, newVal);
        }
      })
    };
    this.defSettings = function(settings){
      if(settings === undefined)
        var settings = {};
      this._settings = settings;
      Object.defineProperty(this, "settings", {
        get: function(){
          return this._settings;
        },
        set: function(newSettings){
          this._settings = $.extend(this._settings, newSettings);
          this.refresh("settings");
          this.trigger("settings", this._settings);
        }
      });
    };
    this.defMethod = function(name, handler){
      var self = this;
      var disallowed = ["handlers", "on", "off", "trigger", "elements", "render", "refresh", "destroy", "defMember", "defSettings", "defMethod", "guid", "clean"];
      for(var i=0; i<disallowed; i++){
        if(
          disallowed[i] == name ||
          "_"+disallowed[i] == name
        ) return false;
      }
      this["_"+name] = handler || function(){};
      this[name] = function(){
        var returned = self["_"+name].apply(self, arguments);
        self.trigger(name, arguments);
        return (returned!=undefined)?returned:self;
      };
    };

    Obj.directory[this.guid] = this;
  };

  /*
  * Statics
  */
  Obj.version = "3.0.2";
  Obj.directory = {};
  Obj.extend = function(child, parent){
    if(!parent)parent = Obj;
    var Proto = function(){
      parent.apply(this, arguments);
      child.apply(this, arguments);
    };
    child.prototypoe = Object.create(parent.prototype);
    Proto.prototype = Object.create(child.prototype);
    return Proto;
  };
  Obj.create = function(o){
    if(typeof(o) == "function"){
      return Obj.extend(o);
    } else if(typeof(o) == "object"){
      var Proto = function(){
        Obj.apply(this, arguments);
        for(var k in o){
          if(typeof(o[k]) == "function"){
            this.defMethod(k, o[k]);
          } else {
            this.defMember(k, o[k]);
          }
        }
        if(this.init){
          this.init.apply(this, arguments);
        }
      };
      return Proto;
    } else {
      function Proto(){
        Obj.apply(this);
      };
      Proto.prototype = Object.create(Obj.prototype);
      return Proto;
    }
  };
  Obj.clean = function(){
    for(var guid in Obj.directory){
      Obj.directory[guid].clean();
    }
    return this;
  };

  return Obj;
})();

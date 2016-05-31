function ToDoList(items, settings){
  Obj.apply(this);
  
  this._settings = {
    delete: false
  };
  Object.defineProperty(this, "settings", {
    get: function(){
      this.trigger("getsettings", this._settings);
      return this._settings;
    },
    set: function(){
      
    }
  });
  
  this.init = function(items, settings){
    
  };
  this.init.apply(this, arguments);
};

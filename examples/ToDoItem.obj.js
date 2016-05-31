function ToDoItem(text, finished){
  Obj.apply(this);
  
  this._text = text;
  Object.defineProperty(this, "text", {
    get: function(){
      this.trigger("gettext", this._text);
      return this._text;
    },
    set: function(newText){
      this._text = newText;
      this.trigger("settext", this._text);
    }
  });
  
  this._finished = !!finished;
  Object.defineProperty(this, "finished", {
    get: function(){
      this.trigger("getfinsihed", this._finished);
      return this._finished;
    },
    set: function(newFinished){
      this._finished = !!newFinished;
      this.trigger("setfinshed", this._finished);
      if(this._finished)
        this.trigger("finished");
      else
        this.trigger("unfinished");
    }
  });
  
  this._removed = !!finished;
  Object.defineProperty(this, "removed", {
    get: function(){
      this.trigger("getremoved", this._fremoved);
      return this._fremoved;
    },
    set: function(newRemoved){
      this._finished = !!newRemoved;
      this.trigger("setremoved", this._removed);
      if(this._removed)
        this.trigger("removed");
      else
        this.trigger("unremoved");
    }
  });
  
  this.renderer = function(){
    if(this._removed)return $();
    var self = this;
    var $ToDoItem = $("<div class='ToDoItem"+((this._finsihed)?" ToDoItem-finished":"")+"'><span class='ToDoItem-text'>"+this._text+"</span></div>");
    
    $("<button class='ToDoItem-finishedBtn'></button>").on("click", function(e){
      self.finsihed = !self._finished;
    }).prependTo($ToDoItem);
    
    $("<button class='ToDoItem-removeBtn'></button>").on("click", function(e){
      self.removed = true;
      self.destroy();
    }).appendTo($ToDoItem);
    
    return $ToDoItem;
  };
  
  this.init = function(text, finished){
    if(text !== undefined)
      this._text = text;
    if(finished !== undefined)
      this._finsihed = !!finished;
    
    this.trigger("init", arguments);
  };
  this.init.apply(this, arguments);
};

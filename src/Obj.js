window.Obj = function(o){
  return function(){
    var self = this, id = Obj.__counter++, members = {};
    Object.defineProperty(this,"objID",{get:function(){return id}});
    for(var k in o){
      if(k != "init"){
        if(typeof(o[k]) == "function" || k[0] == "_") this[k] = o[k];
        else {
          members[k] = o[k];
          (function(k){
            Object.defineProperty(self, k, {
              get: function(){
                return members[k];
              },
              set: function(value){
                members[k] = value;
                Obj.refresh(self, k, value);
              },
              enumerable: true
            })
          })(k);
        }
      }
    }
    if(o.init) o.init.apply(self, arguments);
  };
};
Obj.__counter = 0;
Obj.parse = function(html){
  if(!html) return;
  if(html instanceof HTMLElement) return html;
  var temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.childNodes[0];
};
Obj.render = function(obj, $targets){
  if(!obj.render) return Obj;
  else if($targets instanceof HTMLElement) var $targets = [$targets];
  else if(typeof($targets) == "string") var $targets = document.querySelectorAll($targets);
  else if(!$targets){
    var $el = Obj.parse(obj.render());
    if($el){
      $el.setAttribute("objid", obj.objID);
      return $el;
    }
  }
  if($targets){
    var $els = [];
    for(var i=0; i<$targets.length; i++){
      var $el = Obj.parse(obj.render());
      if($el){
        $el.setAttribute("objid", obj.objID);
        $targets[i].appendChild($el);
        $els.push($el);
      }
    }
    return $els;
  }
  return Obj;
};
Obj.refresh = function(obj, name, value){
  if(!obj.render && !obj.refresh) return Obj;
  var $targets = document.querySelectorAll('[objid="'+obj.objID+'"]');
  if(obj.refresh){
    for(var i=0; i<$targets.length; i++){
      var $newEl = obj.refresh($targets[i], name, value);
      if($newEl){
        $newEl.setAttribute("objid", obj.objID);
        $targets[i].parentNode.replaceChild($newEl, $targets[i]);
      }
    }
  } else if (obj.render){
    for(var i=0; i<$targets.length; i++){
      var $newEl = Obj.parse(obj.render());
      if($newEl){
        $newEl.setAttribute("objid", obj.objID);
        $targets[i].parentNode.replaceChild($newEl, $targets[i]);
      } else {
        $targets[i].parentNode.removeChild($targets[i]);
      }
    }
  }
  return Obj;
};
Obj.version = "4.0.1";

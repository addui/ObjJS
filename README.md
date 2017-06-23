# Obj.JS

[Read the Docs](https://dustinpoissant.github.io/ObjJS/)

![](docs/ObjJS-purple.png)

An Object-Oriented approach to reactive programming.

```javascript
var HelloWorld = Obj({
  text: "Hello World",
  render: function(){
    return "<p>" + this.text + "</p>";
  }
});
Obj.render(new HelloWorld(), document.body);
```

##### Small
Other frameworks that claim to be "small" are around 3kb; **Obj.JS** is about 1/6th of the size of these "small" frameworks coming in at 621 bytes when compressed and gzipped.

##### Fast
**Obj.JS** is an abstraction layer above the DOM and does not keep any DOM elements in memory. This reduces your apps memory footprint and keeps it running fast.

##### Easy To Use
If you know Object-Oriented Programming than you already know how to use **Obj.JS**. Just give your prototype a `render` method and let **Obj.JS** handle the rest.

### How is Obj.JS different?

##### Not Opinionated
Unlike other reactive frameworks, **Obj.JS** does not tell you how to write your code. You do not need to create your protoypes with a "type", "props" and "children" as other reactive frameworks require, create your prototypes with whatever properties you want. **Obj.JS** does not have lengthy tutorials on "the correct way" to use it, because "the correct way" is however you want.

##### No Bloat
Obj.JS does not ship with unnecessary code. As of version 4.0 **Obj.JS** no longer ships with an event management system, DOM manipulation system or complex object storage system. It stays closer to Vanilla JS making it smaller, faster and easier to use. While other frameworks aim to be feature rich, **Obj.JS** aims to be simple and flexible.

### Getting Started
##### 1. Creating a prototype
To create a new prototype pass an object literal into the `Obj()` function, it will return a prototype that is ready to be instantiated.
```javascript
var Person = Obj({
  first: "foo",
  last: "bar",
  sayHi: function(){
    alert("Hello " + this.first + " " + this.last);
  }
});
```

##### 2. Creating an instance
Use the `new` keyword to create new instances of this prototype, you can now access it's members and call it's methods.
```javascript
var p = new Person();
p.sayHi(); // Alerts "Hello foo bar"
p.first = "JS";
p.last = "World";
p.sayHi(); // Alerts "Hello JS World"
```

##### 3. Add an initializer
Create an `init` method to initialize the instance.
```javascript
var Person = Obj({
  first: null,
  last: null,
  sayHi: function(){
    alert("Hello " + this.first + " " + this.last);
  },
  init: function(first, last){
    this.first = first;
    this.last = last;
  }
});
```

##### 4. Create an instance with arguments
The constructor's arguments will be forwarded to the `init` method.
```javascript
var p = new Person("Dustin", "Poissant");
p.sayHi(); // Alerts "Hello Dustin Poissant"
```

##### 5. Make it renderable
Create a `render` method to make the object renderable. This method should return an HTML string or `HTMLElement` object.
```javascript
var Person = Obj({
  first: null,
  last: null,
  sayHi: function(){
    alert("Hello " + this.first + " " + this.last);
  },
  init: function(first, last){
    this.first = first;
    this.last = last;
  },
  render: function(){
    var self = this,
    $btn = document.createElement("button");
    $btn.innerText = "Say Hi";
    $btn.addEventListener("click", function(){
      self.sayHi();
    });
    return $btn;
  }
});
```

##### 6. Render it
Render the instance using the `Obj.render()` function. The first argument should be the instance, the second should be the target.

The target can be a query string, `HTMLElement` or array of `HTMLElement`s.

The `Obj.render()` function returns the rendered `HTMLElement` or array of `HTMLElement`s if it was rendered to multiple targets.
```javascript
var p = new Person("Dustin", "Poissant");
Obj.render(p, "#target");
```

### Make it Respond
**Obj.JS** is a responsive Object-Oriented framework, this means that the DOM will respond to changes in the instance. Whenever a member (non-function property) of your instance changes all rendered elements will automatically be updated.

Properties that start with an underscore (\_) will not trigger an automatic refresh when they are modified.

```html
<div id='target'></div>
<button onclick='c.start()'>Start</button>
<button onclick='c.stop()'>Stop</button>
<button onclick='c.count = 1'>Reset</button>
```

```javascript
var Counter = Obj({
  count: 0,
  interval: 1000,
  _intervalID: null,
  start: function(){
    clearInterval(this._intervalID);
    var self = this;
    this._intervalID = setInterval(function(){
      self.count++;
    }, this.interval);
  },
  stop: function(){
    clearInterval(this._intervalID);
  },
  render: function(){
    return "<p>" + this.count + "</p>";
  },
  init: function(count, interval){
    this.count = count || 0;
    this.interval = interval || 1000;
  }
});
var c = new Counter(1);
Obj.render(c, "#target");
```

### Make it Fast
When a member is changed the entire element is re-rendered and replaced. If the rendered object is complex (multiple elements deep with many event handlers) this can make your page slow.

To fix this problem you should give your prototype a `refresh` method. This method should accept 3 arguments: the element that needs to be updated, the name of the property that was changed and the new value of that property.

Your `refresh` method should make the minimal amount of changes to the DOM to represent the new state of the object. Optionally it can return a new `HTMLElement` to replace the current element, but again this is slow and should be avoided if at all possible.

Lets create a `refresh` method for the previous example to make it faster:

```javascript
var Counter = Obj({
 /* ... */
 refresh: function(element, property, value){
   if(property == "count") element.innerText = value;
   if(property == "interval") this.start();
 }
});

var c = new Counter(1);
Obj.render(c, "#target");
```

Authored By: [Dustin Poissant](http://github.com/dustinpoissant/)

[dustinpoissant@gmail.com](dustinpoissant@gmail.com)

License: [CC-BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/)

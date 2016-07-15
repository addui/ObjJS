# Obj.JS

```JavaScript
new Obj().render("body");
```

![](res/icon.png)

## Table of Contents
 - [Introduction](#introduction)
 - [Creating a New Prototype](#creating-a-new-prototype)
   - [Instantiation](#instantiation)
 - [Arguments](#arguments)
 - [Initialization](#initialization)
 - [Event-Driven Methods](#event-driven-methods)
   - [on](#on-event-handler-max-count)
   - [off](#off-event-handler)
   - [trigger](#trigger-event-data)
 - [Reactive Methods](#reative-methods)
   - [render](#render-target-selector-option)
   - [refresh](#refresh-changed)
   - [destroy](#destroy)
   - [renderer](#renderer)
   - [refresher](#refresher-element-changed)
   - [destroyer](#destroyer-element)
 - [Reactive Members / Methods](#reactive-members-methods)
   - [defMember](#defmember-name-default-value-setter-func-getter-func)
   - [defSettings](#defsettings-default-settings)
   - [defMethod](#defmethod-name-func)
 - [Complete Examples](#complete-examples)

## Introduction

**Obj.js** is an Reactive Event-Driven Object-Oriented JavaScript Framework built on [jQuery](http://jquery.com).

That is a mouthful so what does it mean?
 - **Reative** = Data is automatically bound, any changes made to the object (model) will automatically update the DOM (view).
 - **Event Driven** = Instead of using callbacks you can listen for events that happen within the object using the `on` method.
 - **Object-Oriented** = Everything should be created as objects (prototypes) that extend the base `Obj` object.
 - **Framework** = This script does not "do" anything, by itself it does not give your site any additional functionality, but rather it is a set of base code that can be used to build widgets/plugins.
 - **JavaScript** = If you don't know what JavaScript is get off the internet and crawl back under your rock.
 - **jQuery** = A DOM manipulation library/framework for JavaScript, again if you don't know what jQuery is then this is not for you. jQuery is not included within "Obj.js" and should be downloaded separately and imported into your document.

[Click Here for more information about Object-Oriented Programming](OOP.md)
[Click Here for more information about Event-Driven Programming](EDP.md)

## Creating a new Prototype
**Obj.JS** provides a base prototype called `Obj` which is meant to be extended to build custom Event-Driven Reactive prototypes, so how do you extend it?

1. Define your prototype's constructor using the `function` keyword. This can be done using either `function MyProto(){}` or `var MyProto = function(){}`.
2. Then, within your constructor, apply `Obj` to `this` prototype so that it inherits `Obj`'s members and methods.
3. Assign a new instance of `Obj`'s prototype to your prototype's "prototype" property so that `instanceof` works.

Throughout these examples we will be creating a "Button" prototype.
```JavaScript
function Button(){
  Obj.apply(this);
};
Button.prototype = Object.create(Obj.prototype);
```

### Instantiation
Create new instances of your prototype using the `new` keyword.
```JavaScript
var myBtn = new Button();
```

## Arguments
At some point you will likely want to pass arguments into your prototype's constructor. To do this define them as arguments of your constructor function.

In this example we will be assigning the "label" and "action" arguments to members / methods, but these members / methods will not be "event-driven" or "reactive" yet, we will look at how to define reactive "event-driven" members and methods in a [later section](#reactive-members-methods).
```JavaScript
function Button(label, action){
  Obj.apply(this);
  this.label = label;
  this.action = action;
};
Button.prototype = Object.create(Obj.prototype);
```

Now that your prototype can handle accepting arguments lets look at how we would pass arguments into the prototype at the time of instantiation.
```JavaScript
var myBtn = new Button("My Label", function(){
  console.log("You pressed the button")
});
```

## Initialization
Often we find that there is some code we want to run once at the time of construction, we can simply place it in the constructor after defining all members and methods but it's good practice to wrap this code into an initialization method named `init` and then call this function once passing on our arguments. This is often done for code organization / readability and reusability (objects can be re-initialized).

```JavaScript
function Button(label, action){
  Obj.apply(this);
  this.label = "Button"; // A default label
  this.action = function(){}; // A default action
  this.init = function(label, action){
    if(label)
      this.label = label;
    if(action)
      this.action = action;
    /* Other code to run durring construction */
  };
  this.init.apply(this, arguments);
};
Button.prototype = Object.create(Obj.prototype);
```

## Event-Driven Methods
If you are not familiar with Event-Driven Programming please read [this](EDP.md).

These three methods are used to listen for / trigger events within the prototype.

*Note:* In **all** methods described below you can passing in multiple events by separating them by a space.

#### on(event, handler [, max_count])
This method is used to start listening for an event within the prototype.

 - **event**: A single word that will be "triggered" when an event (described by the word) occurs.
 - **handler**: A function that will be called when the event occurs, it takes 2 arguments, the first will be the name of the event that was triggered, the second will be any data that was given about the event.
 - **max_count**: The maximum number of times that this handler will be called. This was used to replace the "once" method in version 1. Now you can specify `1` instead, but with the added benefit of being able to specify any number. `0` is the default and indicates that there is no limit.

This method can be used internally (within the prototype) or externally (outside the prototype) but is typically used externally.

In this example we will be using the `Button` prototype defined above. To listen for the "something_happened" event we would do the following:

```JavaScript
var myBtn = new Button("My Button");

myBtn.on("something_happened", function(event, data){
  console.log("Something just happended");
});
```

#### off([event [, handler]])
This method is used to remove an event listener that was previously assigned using "on". This method can be used internally or externally but is typically used externally.
There are three ways to use this method:

##### off()
Calling this method with no arguments will cause all event listeners to be removed.

##### off(event)
Calling this method and passing in a string as the only argument will remove all event listeners that are listening for that event.

##### off(handler)
Calling this method and passing in a function as the only argument will remove that handle from all events it is listening for.

#### off(event, handler)
Calling this method and providing both a string and a function (order does not matter) will remove all combinations of this event and this handler.

```JavaScript
var myBtn = new Button("My Button");
function handler(event, data){
  console.log("Something just happended");
}
myBtn.on("something_happened", handler);
myBtn.off("something_happended", handler); // Removes the above "on"
```

#### trigger(event [, data])
This method is used to trigger handlers that are listening for an event that has happened within/to the object. Optionally a single piece of data (any kind) can be passed to the handler via the second argument.

This method can be used internally or externally but is typically used internally.

```JavaScript
var myBtn = new Button("My Button");
function handler(event, data){
  console.log("Something just happended");
}
myBtn.on("something_happened", handler);
myBtn.trigger("something_happened");
myBtn.off("something_happended", handler); // Removes the above "on"
myBtn.trigger("something_happened");
```

Here is the console output from the above script.
```text
Something just happended
```

***Note:** When triggering an event you may want to pass multiple pieces of data to the handler, but this method only allows 1, but it does not restrict the data type, so pass object with multiple properties.*

## Reactive Methods
Objects created from prototypes that extend `Obj` have the ability to be rendered to the DOM and automatically refreshed when internal data changes. The following methods are used to handle the interactions between the object and the DOM.

#### render(target_selector [, option])
This method renders the object to the DOM. The `target_selector` should be a jQuery selector or jQuery object that points to the DOM element where the object will be rendered.

This options parameter can be one of 7 strings and determine how the object is rendered. This parameter is optional and is set to "append" by default.
 - **append** = Renders the object's element within the target element after all children.
 - **prepend** = Renders the object's element within the target element before all children.
 - **after** = Renders the object's element after the target element.
 - **before** = Renders the object's element before the target element.
 - **replace** = Replaces the target element with the object's element.
 - **return** = The object's element is returned by the method and is **not** rendered to the DOM.
 - **none** = The object's element is generated but is **not** returned or rendered to the DOM.

This method should **only** be used externally (outside the prototype definition).

This example uses the `Button` class defined above and renders it to the body of the document.

```JavaScript
new Button("My Button").render("body", "append");
// OR
var myBtn = new Button("My Button");
myBtn.render("body", "append");
```

#### refresh([changed])
This method refreshes an element that has already been rendered to the DOM. Optionally a "changed" argument can be passed into the method telling the [refresher](#refresher-element-changed) (discussed later) what has changed.

This method can be used internally or externally but is more often used internally.

```JavaScript
function Button(label, action){
  Obj.apply(this);
  this.label = label;
  this.changeLabel = function(newLabel){
    this.label = newLabel;
    this.trigger("label_changed");
    this.refresh("label");
  };
}
Button.prototype = Object.create(Obj.prototype);

var myBtn = new Button("My Button");
myBtn.render("body");
myBtn.changeLabel("Another Label");
```

In the above example a button with a label of "My Button" would first be rendered and then when the label is changed text in the DOM button will automatically be updated to "Another Label".

#### destroy()
This method is used to destroy the element rendered by this object. This method takes no arguments.

```JavaScript
var myBtn = new Button("My Button");
myBtn.render("body");
myBtn.destroy();
```

### User Defined Reactive Methods
These methods have defaults already defined by `Obj` but should be overwritten within your custom prototype.

#### renderer()
This method is called by [`render`](#render-target-selector-option), it should return a HTMLElement or jQuery object that represents the object.

Here is the "renderer" function for our `Button` prototype.
```
function Button(label, action){
  Obj.apply(this);
  this.label = label;
  this.action = action;
  this.renderer = function(){
    var self = this; // The current context is saved for when it goes out of scope within the jQuery event handler define below
    return $("<button>"+this.label+"</button>").on("click", function(){
      self.action.call(self);
    });
  };
}
Button.prototype = Object.create(Obj.prototype);
```

#### refresher($element, changed)
If this method is defined it is called within the [`refresh`](#refresh-changed) method. If it is not defined the element will be destroyed and rendered to "refresh" it.

This method is used to refresh the DOM element without having to destroy it and re-render it.

Because a single object can be rendered multiple times, this method will be called once for each rendered element and the jQuery object containing the rendered element will be passed in as the first argument. The second argument will be the "changed" string passed into the [`refresh`](#refresh-changed) method when it was called. This can be useful to only refresh the part of the element effected by the change, but keep in mind this may be `undefined`.

```
function Button(label, action){
  Obj.apply(this);
  this.label = label;
  this.action = action;
  this.renderer = function(){
    var self = this; // The current context is saved for when it goes out of scope within the jQuery event handler define below
    return $("<button>"+this.label+"</button>").on("click", function(){
      self.action.call(self);
    });
  };
  this.refresher = function($element, changed){
    if(changed == "label"){
      $element.html(this.label);
    }
  };
}
Button.prototype = Object.create(Obj.prototype);
```

In the above example the method does not return anything, but it optionally can return an HTMLElement or jQuery object. Returning an element will cause the current element to be destroyed and replaced by the returned element.

In this example, if the changed is the "label" it is refresh as simply as possible, if the change is the "action" no refresh is necessary, and any other (unexpected) change will result in the object be re-rendered.

```
function Button(label, action){
  Obj.apply(this);
  this.label = label;
  this.action = action;
  this.renderer = function(){
    var self = this; // The current context is saved for when it goes out of scope within the jQuery event handler define below
    return $("<button>"+this.label+"</button>").on("click", function(){
      self.action.call(self);
    });
  };
  this.refresher = function($element, changed){
    if(changed == "label"){
      $element.html(this.label);
    } else if(change == "action"){
      // Do nothing
    } else {
      return this.renderer.call(this); // Rerender
    }
  };
}
Button.prototype = Object.create(Obj.prototype);
```

#### destroyer($element)
If this method is defined then it will be called when the [`destroy`](#destroy) method is called. The rendered element is passed in as the only parameter. Because the object may be rendered multiple times, this method is called once for each rendered element.

This method should not return any values.

```
function Button(label, action){
  Obj.apply(this);
  this.label = label;
  this.action = action;
  this.destroyer = function($element){
    console.log("This element was destoryed");
    console.log($element[0]);
  }
}
Button.prototype = Object.create(Obj.prototype);
```

## Reactive Members / Methods
In all prior examples members and methods were defined without being event-driven or reactive. In the [refresh](#refresh-changed) example we manually triggered an event and called the `refresh` method to tell the object to refresh itself. That shows how to manually handle triggering events and reactive refreshes for methods, now we will discuss how to manually trigger events and refreshes for members, and then we will discuss how to use **Obj.JS** to create members and methods that are automatically reactive and automatically trigger events.

##### Manually define Reactive Members
To manually trigger an event or a refresh on a method we can do so by calling the `trigger` and `refresh` methods from without our custom method. But to trigger a event or a refresh when a member is changed we must use property getter and setter. We will also need a place to store that data, this is called a "private" or "raw" data member, as a convention an underscore (`_`) is used to prefix "private" or "raw" members. And then after defining the raw data we must use `Object.defineProperty` to define a custom property with a getter and setter function.

```JavaScript
function Button(label, action){
  Obj.apply(this);
  this._label = label;
  Object.defineProperty(this, "label", {
    get: function(){
      this.trigger("getlabel label", this._label);
      return this._label;
    },
    set: function(newLabel){
      this._label = newLabel;
      this.trigger("setlabel label", this._label);
      this.refresh("label");
    }
  });
  this.action = action;
}
Button.prototype = Object.create(Obj.prototype);
```

`Object.defineProperty` works very well and should be used when defining more complex getters and setters but this is a lot of code to write to create just 1 member. **Obj.JS** provides a methods that boilerplates the above code so you have to write less code.

#### defMember(name [, default_value [, setter_func [, getter_func ]]])
This method defines a member within your object, it creates a private member with the name specified by the first parameter prefixed with an underscore (`_`). It can take between 1 and 4 arguments.
 - **name** = The name of the member to be created.
 - **default_value** = The default value of the member.
 - **setter_func** = A function to be called when the member is set. This function's only argument will be the new value and the function should return a value that will be assigned to the private member.
 - **getter_func** = A function to be called when the member is gotten. This function's only argument is the current value of the member and the function should return a value that will be given to the requesting script.

This example defines does **exactly the same** as the example above but with a lot less code.

```JavaScript
function Button(label, action){
  Obj.apply(this);
  this.defMember("label", label);
  this.action = action;
}
Button.protoype = Object.create(Obj.prototype);
```

This example represents an product for sale, it stores its price as an integer in the "raw" member, but the user should set the value as a currency value string (`"$1.23"`). This example also uses an [initialization](#initialization) method.

```JavaScript
function Product(name, price){
  Obj.apply(this);
  this.defMember("name");
  this.defMember("price", 0,
    function(newValue){ // Setter
      if(typeof(newValue) == "string"){
         if(newValue[0]=="$")
           newValue = newValue.substr(1);
         newValue = parseFloat(newValue);
      }
      if(
        typeof(newValue) == "number" &&
        !isNaN(newValue)
      ) return Math.round(newValue*100); // Convert from dollars to pennies
      else return this._price; // Do not changed
    },
    function(value){ // Getter
      return "$"+(value/100); // Convert from pennies to dollars
   }
 );
 this.init = function(name, price){
   if(name)
     this.name = name;
   if(price)
     this.price = price;
   this.trigger("init", {
     name: name,
     price: price
   });
 }
 this.init.apply(this, arguments);
}
Product.prototype = Object.create(Obj.prototype);
```
  
#### defSettings([default_settings])
One of the most common members that prototypes have is a "settings" member. This member is often a object literal, containing many settings. But when a new settings object is "set" you likely will not want to overwrite the settings that were not passed into the new object. This method creates a settings member and uses a setter that merges the new settings into the old settings.

This methods only argument is the default settings object, this is optional.

```JavaScript
MyProto(){
  Obj.apply(this);
  this.defSettings({
    mySetting1: 1,
    mySetting2: 2
  })
}
MyProto.prototype = Object.create(Obj.prototype);

var myObj = new MyProto();
console.log(myObj.settings);
myObj.settings = {mySetting2: 3};
console.log(myObj.settings);
```

In the above example, this first `console.log` would log:
```JavaScript
{
  setting1: 1,
  setting2: 2
}
```

And the second would log:
```JavaScript
{
  setting1: 1,
  setting2: 3
}
```

#### defMethod(name [, func])
Just like members, **Obj.JS** supplies this method to help boilerplate the process of creating an event-driven method. When creating a method using `defMethod` it will automatically trigger an event with the same name as the member (all lower case).

```JavaScript
function Button(label, action){
  Obj.apply(this);
  this.defMember("label", label);
  this.defMethod("action", action);
}
Button.prototype = Object.create(Obj.prototype);
```

## The GUID
Each **instance** is assigned a Globally Unique Identifier or GUID. This is stored as a member named `guid`. It should be treated a static, you can access it if you want but **DO NOT CHANGE IT**, the guid is also added to the rendered element as an attribute.

#### Objs
**Obj.JS** exposes a global variable called `Objs`, this variable is an object where **every** instance of `Obj` (and prototypes that extend `Obj`) is stored, it's key is the instance's GUID. This can be useful for getting the object from the DOM.

```JavaScript
new Button("My Button").render("#target");

// Then in another script
var btn = Objs[$("#target").children("button").attr("guid")];
// Now you can use "btn"
```

## Complete Examples

### Button Example
```JavaScript
function Button(label, action){
  Obj.apply(this);
  this.defMember("label", "Button");
  this.defMethod("action", function(){return this});
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
```

## Image with Caption
```JavaScript
function Image(src, caption, styles){
  Obj.apply(this);
  this.defMember("src");
  this.defMember("caption");
  this.defMember("styles", {
    width: 500,
    height: 282
  }, function(newStyles){
    return $.extend(this._styles, newStyles);
  });
  this.renderer = function(){
    var $image = $("<div class='image'></div>");
    if(this.caption)
      $("<div class='image-caption'>"+this.caption+"</div>").appendTo($image);
    $image.css(this.styles);
    return $image;
  };
  this.refresher = function($element, changed){
    if(changed == "caption"){
      $element.children(".image-caption").html(this.caption);
    } else if(changed == "styles"){
      $element.css(this.styles);
    } else if(changed == "action"){
    } else {
      return this.renderer.call(this);
    }
  };
  
  this.init = function(src, caption, styles){
    if(src)
      this.src = src;
    if(caption)
      this.caption = caption;
    if(styles)
      this.styles = styles;
  }
}
```















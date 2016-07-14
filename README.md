#Obj.JS
```
new Obj().render("body");
```
![](res/icon.png)

##What is Obj.JS
**Obj.js** is a Reactive, Event Driven, Object-Oriented Framework for JavaScript built using jQuery.

That is a mouthfull so what does it all mean?

 - **Reative** = Data is automatically bound, any changes made to the object (model) will automatically update the DOM (view).
 - **Event Driven** = Instead of using callbacks you can listen for events that happen within the object usign the `on` method.
 - **Object-Oriented** = Everything should be created as objects (prototypes) that extend the base `Obj` object.
 - **Framework** = This script does not "do" anything, by itself it does not give your site any additional functionality, but rather it is a set of base code that can be used to build widgets/plugins.
 - **JavaScript** = If you don't know what JavaScript is get off the internet and crawl back under the rock.
 - **jQuery** = A DOM manipluation library/framework for JavaScript, again if you don't know what jQuery is then this is not for you. jQuery is not including within "Obj.js" and should be downloaded separetly and included in your document.
 
##Quick Start
###Create a new Prototype
You can extend `Obj` using one of the many many methods available within JavaScript. I personaly prefer to simply `apply` the members/methods of a prototype to my new prototype essentially copying them give a more "class" feel.
```
function MyButton(){
  Obj.apply(this);
}
```

###Give your prototype some methods/members
```
function MyButton(){
  Obj.apply(this);
  this.label = "Click Me";
  this.action = function(){
    alert("You clicked my button");
  };
}
```

###Create a `renderer` method that returns an HTMLElement (or jQuery object).

```
function MyButton(){
  Obj.apply(this);
  this.label = "Click Me";
  this.action = function(){
    this.trigger("action"); // Trigger an event letting anybody "listening" know what just happened.
    alert("You clicked my button");
  };
  this.renderer = function(){
    var self = this;
    return $("<button>"+this.label+"</button>").on("click", function(){
      self.action();
    });
  }
}
```

###Create some instances and render them to the DOM
```
  var myObj = new MyButton();
  myObj.render("body", "append"); // append to the body
  myObj.render("#target", "replace"); // replace an element with an ID of "target" with this object.
```

##Event Driven Methods
These methods (and private members) are used to give this framework it's Event-Driven properties. Private members/methods begin with an `_`, this indicates that they should only be accessed from within the object.

 - `_handlers` = Holds all of the event handlers that are listening on this object.
 - `_onceHandlers` = Holds all the single use event handlers that are listening on this object.
 - `on(events, handler)` = Used to regerster new handlers on events, the `events` parameter is a space delimited list (string) of events to listen for, the `handler` paramter is the function that should be called when that event happens.
 - `once(events, handler)` = Used to register new single use handlers on events, once the handler has been called once it is removed.
 - `off(events[, handler])` = Removes event listeners that were previously registered using `on`, the handler is optional, if not provided all handlers listening for that event will be removed.
 - `off(handler)` = Removes event listeners that were previously registered using `on`.
 - `offOnce(events[, handler])` Removes event listeners that were previously registered using `once`, the handler is optional, if not provided all handlers listening for that event will be removed.
- `offOnce(handler)` = Removes event listeners that were previously registered using `once`.
- `trigger(events[, data])` = Triggers an event within this object, you can pass an optional second argument that will be forwarded to the handler.

###Handlers
Handlers should take two arguments, the first argument is the event (string) that was trigger, and the second argument will be the data argument if one was provided by the trigger.

###Listing for All Events
You can register a handler to listen for all events by passing the keyword `"all"` as the event name.

##Reactive Methods
These methods (and private members) are used to give this framework it's Reactive properties

 - `guid` = An automatically genereted Globally Unique Identifier that identifies each instance of this object. A "guid" attribute is automatically added to each rendered element.
 - `_parent` = A jQuery object containing the parents of where this element has been rendered.
 - `_elements` = A jQuery object containing a reference to the rendered elements.
 - `renderer()` = This method should create and return an DOM element or jQuery object. This is created by you.
 - `render(target, option)` = This method renders the object to the DOM.
   - Possible options include "append", "prepend", "replace", "after", "before", "return" (will not be rendered only returned) and "none" (will not be rendered).
 - `refresher($element)` = This method should "refresh" the element that was previously rendered. This method has a working default but can be modified by you. If the object has been rendered multiple times this method will be called once for each rendered element. The only parameter is a jQuery object containing the element. If an element or jQuery object is returned that object will replace the original, otherwise you can perform actions that "refresh" the element without re-rendering it.
 - `refresh()` = Refreshes the rendered objects.
 - `destroyer($element)` = This member is used to perform custom actions when the element is about to be destroyed, you can create it but it is not nessisary.
 - `destroy()` = Destroys the rendered elements.
 
 ##Globals
 This framework also exposes the following global functions and variables.
 
  - `generateGUID()` = Generates a Globally Unique Identified.
  - `GUIDList` = An array of previously generated GUIDS (to prevent repeats).
  - `toFunc(anything)` = A function that converts anything to a callable function.
  - `Objs` = An object containing links to all created Obj instances.
  
 
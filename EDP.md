# Event-Driven Programming

**Event-Driven** programming is an alternative way of handling callbacks. Traditionally if we had an object and we wanted to know when something happened within the object we would pass some callbacks into the constructor that would be used to notify an outside script that something happened within the object.

## What's wrong with callbacks?
**Standard Callbacks Example**
```JavaScript
function MyProto(fooCallback, barCallback){
  this.foo = function(){
    console.log("Foo");
    if(fooCallback) fooCallback();
  };
  this.bar = function(){
    console.log("Bar");
    if(barCallback) carCallback();
  }
}

var myProtoInstance = new MyProto(function(){
  console.log("foo happened");
}, function(){
  console.log("bar happened");
});

myProtoInstance.foo();
myProtoInstance.bar();
```

**Output**
```text
Foo
foo happened
Bar
bar happened
```

This above example works well because there are only 2 callback functions, but what if there were 10 or 20 or hundreds. This typical callback situation would not work well. And what if a prototype took 10 callbacks as parameters but you only wanted to specify callback 2 and 8.

```JavaScript
var o = new FooBar(undefined, callback2, undefined, undefined, undefined, undefined, undefined, callback8)
```

This is quickly becomes unmanageable.

## Events

In Event-Driven programming, an "event" is a keyword that is listened for and triggered to call callbacks rather than having to directly specify the callback. This can allow for hundreds of callbacks to be possible very easily. The only catch is that you must start listening for an event after the object has already been initialized.

### How does it work?
EDP works by exposing 3 new methods on an object, one to start listening for an event, one to stop listening for an event, and one to indicate that the event has happened. There are two different common naming conventions for these methods on/off/trigger and subscribe(sub)/unsubscribe(unsub)/publish(pub). **Obj.JS** uses on/off/trigger so we will be using on/off/trigger from now on. Just remember if another site says "subscribe" that is our "on", "unsubscribe" is our "off", and "publish" is our "trigger".

#### on(event, handler)
Event-Driven objects expose a public method called "on" (or "sub"). This allows other scripts to listen for events that happen to the object. This is typically called externally (outside the constructor) but can be used internally as-well.

This method typically takes 2 arguments, the first is the name of the event that you are listening for, the second is the function that will be executed when the event occurs.

The handler function should accept two arguments, the first is the name of the event that just occurred, and the second is some data about the event passed into the trigger/publish method.

#### off([event [, handler]])
Event-Driven objects expose a public method called "off" (or "unsub"). This allows other scripts to stop listening for an event that happens to the object. This is typically called externally (outside the constructor) but can be used internally as-well.

This method typically has two optional arguments, allowing it to be called in 4 different ways.

##### off()
Calling `off` with no arguments will remove all event handlers.

##### off(event)
Calling `off` with a single string as an argument will remove all event listeners for events that match the string.

##### off(event, handler)
Calling `off` with an string and a function as parameters will remove the event handler that matches the specified event and handler.

##### off(handler)
Calling `off` with a single function argument will remove this handler from all events it was listening for.

#### trigger(event [, data])
Event-Driven objects expose a public method called "trigger" (or "pub"). This is used to tell the event system that an event just happened. This is typically called internally (from within the constructor) but can be used externally as-well.

This method takes the name of the event as the first argument and optionally can take some data about the event as the second arguments.

## Simple Example
For this example lets assume we are using the prototype `Obj` that handles all the event-driven logic. We will create a new prototype that extends `Obj` and then uses these event-driven methods.

```JavaScript
function FooBar(){
  Obj.apply(this);
  this.foo = function(){
    console.log("foo");
    this.trigger("foo", {
      fooData: "foo was a function that happened and this is it's data"
    });
  };
  this.bar = function(barArg1){
    console.log("bar ... " + barArg1);
    this.trigger("bar", barArg1);
  }
}
FooBar.prototype = Object.create(Obj);

var fb = new FooBar();
fb.on("foo", function(event, data){
  console.log("foo happened: "+data.fooData);
});
fb.on("bar", function(event, data){
  console.log("bar happened");
});
fb.foo();
fb.bar("This is an argument");
```

**Console Output**

```text
foo
foo happened: foo was a function that happened and this is it's data
bar ... This is an argument
bar happened
```



















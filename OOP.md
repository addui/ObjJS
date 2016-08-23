# Object Oriented Programming (OOP)

Object-Oriented Programming (OOP) is the concept that related pieces of data and functions that act upon that data should be congregated together into a single "object".

This guide to OOP will be written in JavaScript (ECMAScript5).

## Table of Contents
 - [Procedural vs OOP](#procedural-vs-oop)
 - [Objects](#object)
   - [Members](#members)
   - [Methods](#methods)
   - [Private Members/Methods](#private-members-methods)
 - [Prototypes](#prototypes)
 - [Instances](#instances)
 - [Literals](#literals)
 - [Inheritance](#inheritance)

## Procedural vs OOP
In procedural code, data is stored individually in variables and many functions are created in the global scope that the data is passed into via arguments and new data is returned from the function.

In OOP, similar data is aggregated into "objects" and the functions that use this data is also aggregated into the object, it can act on the data without the data being passed into the function, and it can modify that data without returning it.

Here are two examples of code used to introduce a person. The first example is procedural\* and the second is similar but uses OOP. There is some data that represents a person, their age is calculated from their birthdate and they introduce themselves.

\**Note:* I had to use JavaScript's built in `Date` object to retrieve todays date.

###### Procedural
```JavaScript
var first_name = "John";
var last_name = "Doe";
var birthday = "3/2/89"
function age(birthday){
  var birthday_month = parseInt(birthday.split("/")[0]);
  var birthday_day = parseInt(birthday.split("/")[1]);
  var birthday_year = parseInt(birthday.split("/")[2]);
  if(birthday_year < 20)
    birthday_year+=2000;
  if(birthday_year < 100)
    birthday_year+=1900;
  
  var today_month = new Date().getMonth();
  var today_day = new Date().getDate();
  var today_year = new Date().getFullYear();
  
  var age_days = today_day - birthday_day;
  var age_months = today_month - birthday_month;
  var age_years = today_year - birthday_year;
  if(age_days < 0){
    age_months--;
    age_days+=30;
  }
  if(age_months < 0){
    age_years--;
    age_months+=12;
  }
  return age_years + " Years, " + age_months + " Months and " + age_days + " days";
}
function introduce(fn, ln, bd){
  console.log("Hello my name is " + fn + " " + ln + ", and I am " + age(bd) + " old.")
}
introduce(first_name, last_name, birthday);
```

###### OOP
```JavaScript
var person = {
  first_name: "John",
  last_name: "Doe",
  birthday: new Date("3/2/89"),
  age: function(){
    var age = new Date(new Date() - this.birthday);
    console.log(age);
    return (age.getFullYear()-1970) + " Years, " + age.getMonth() + " Months and " + age.getDate() + " days";
  },
  introduce: function(){
    console.log("Hello my name is " + this.first_name + " " + this.last_name + ", and I am " + this.age() + " old.")
  }
};
person.introduce();
```

## Objects
An object is a collection of data and functions to apply to that data. For example a person can have a first name, a last name a birthdate and other data about them. In OOP we would aggregate all that data together into an "object". 

### Members
A member is piece of data that belongs to an object. Any data type can be used as a member. Members are essentially variables that belong to an object. If we had an object called "myObject" with a member called "myMember" we can access this member using `myObject.myMember`.

### Methods
A method is a function that belongs to an object. If we had an object called "myObject" with a method called "myMethod" we can call this method using `myObject.myMethod()`.

### Private Members/Methods
The above members and methods are public methods because they can be accessed from outside the object definition. Alternatively there are private members and methods which are meant to be only accessed internally (from within the objects definition). Unfortunately JavaScript does not have private members / methods, but a common convention is to start the name of the member/method with an underscore `_`,  this indicates that the member/method **should not** be accessed from outside the object definition.

## Prototypes
This works great if we want to create 1 person, but what if we wanted to create hundreds people that all use the same `age` or `introduce` methods, we would have to have hundreds of copies these functions. OOP offers a solution to problem by allowing us to create "blueprints" of objects, from these "blueprints" we can easily create hundreds or thousands of objects that all share some common code because they are objects of the same type/structure. In many languages these "blueprints" are called "Classes" in JavaScript they are called "prototypes", there are some MAJOR differences between classes and prototypes but that goes beyond the scope of this document. But in essence they both act as a "blueprint" from which we can create multiple copies of an object.

### Creating a new Prototype
There are many ways to create prototypes in JavaScript, essentially EVERYTHING is a prototype. Every object could be used as a prototype to create another object. Because everything is a prototype, a `function` is also a prototype, and so one common way of creating a new prototype is to create a new function and use it as a constructor that creates a new prototype. To not confuse functions that are meant to be called as functions and functions that are meant to be used as a prototype a common convention is that "function" names should start with a lower case letter, and "prototype" names should start with a capital letter.

The `this` keyword is used within the prototypes constructor (function) to access the members of the instance that is currently in context (the instance we are currently talking about).

```JavaScript
function MyProto(){
  this.myMember = "This is a member";
  this.myMethod = function(){
    console.log("This is a method");
    console.log("The member is: "+this.myMember);
  };
}
```

### Instances
An instance a an object that was created from a [prototype](#prototypes). For example you can have a red Dodge Viper and I can have a red Dodge Viper and these two cars can be 100% identical in every aspect, they are essentially "the same car", but they are not the same car, yours is yours and mine is mine, they are two instances of the same prototype.

To create an instance of a prototype we use the `new` keyword and call the function.

```JavaScript
var myInstance1 = new MyProto();
var myInstance2 = new MyProto();
myInstance2.myMember = "Member Value";
myInstnace1.myMethod();
myInstance2.myMethod();
```

**Console Output**
```Text
This is a Method
The member is: This is a member
This is a Method
The member is: Member Value
```

### Literals
A "literal" is an object that is also it's own prototype. We saw an example of this before, it uses the curly bracket notation (`{}`). This should be used if you only plan on creating one object of this type.

```JavaScript
var myLiteral = {
  myMember: "This is a member",
  myMethod: function(){
    console.log("This is a method");
  }
}
```

## Inheritance
Inheritance is the idea that one blueprint can be created from another blueprint and it automatically "inherits" all of the members and methods from the blueprint it was created from. The blueprint used to create the new blueprint is called the "parent" and the new blueprint is called the "child". In JavaScript there are are many different methods for achieving inheritance, the one I typically use is the "apply" approach.

First create the "parent" prototype.
```JavaScript
function ParentProto(){
  this.parentMember = "World";
  this.method1 = function(){
    console.log("Hello "+this.parentMember);
  }
}
```

Then create the "child" prototype and apply the parent to it.

```JavaScript
function ChildProto(){
  ParentProto.apply(this);
  this.method1 = function(){ // Overwrite parent method
    console.log("Goodbye "+this.parentMember);
  }
}
```

And then the final (optional) step is to assign the prototype so that `instanceof` works.

```JavaScript
ChildProto.prototype = Object.create(ParentProto.prototype);
```

### Putting it all together

To extend the `Obj` prototype defined in **Obj.JS** we would use.
```JavaScript
function MyProto(){
  Obj.apply(this);
  // Define my members and methods here
}
MyProto.prototype = Object.create(Obj.prototype);
```


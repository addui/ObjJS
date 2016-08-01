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

### Instances

### Creating a new Prototype

### Literals

## Inheritance
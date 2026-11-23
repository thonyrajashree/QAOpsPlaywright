/*function login(username: string ){
    console.log('Login in successful for user: ' + username);

}
login('JohnDoe');*/



function add( a: number , b: number) {

    return a + b;
}

console.log(add( 0,9));


const subbb = function sub(c: number, d: number) {
    return c - d;
}
console.log(subbb(10,3));

function greet(message : string , name: string) {
    return message + ' ' + name;


}
console.log(greet('Hello', 'Raj'));

function greet1(name1: string){
 return name1;
}

console.log(greet1('Anu'));
console.log(greet1('Raj'));

//Function expression
const greet2 = function (name2: string){
    return 'Hello' + ' '+ name2;
    
}

console.log(greet2('Sita'));
 // the difference between function declaration and function expression is that function declaration is hoisted to the top of the scope and can be called before it is defined, while function expression is not hoisted and can only be called after it is defined.

 const  multipl =function (a: number, b: number) {

    return a * b;

 }
 console.log(multipl(2,6));

 
function welcome(name1: string){ // function to welcome user
 return 'welcome' + " " + name1;
}

console.log(welcome('Raj'));

function calculateAge( birthyear : number){ // function to calculate age based on birth year
    return 2026 - birthyear;
}

console.log(calculateAge(2002));

const multiply = (a: number, b: number) => a * b; // arrow function
console.log(multiply(3, 4));

const greet4 =(name: string) => "Hello " + name;
console.log(greet4('Anu'));



const age = 34;

if (true) {

    const age = 25;
 console.log(age);
    
}
 console.log(age);

console.log(age);

let age1 = 25//
age1 = 30;//

console.log(age1);//



const actual = "  LOGIN SUCCESSFUL  ";
const expected = "login successful";

const result = actual.trim().toLowerCase() ;
console.log(result === expected);


console.log('stringgggggggggggg----------------------------------------');

let day = ' Monday Tuesday '

console.log(day.length);

console.log(day.trim().length);
console.log(day.slice(0,8))

const message = "Order ORD123 created successfully";

console.log(message.includes('ORD123'));


let date = '23';
let nextDate = '27';

let diff = parseInt(nextDate) - parseInt(date);

console.log(diff);
const cresult = diff.toString();
console.log(typeof(cresult));

let newQuote = "tuesday is Funday day";
let count = 0;

let value = newQuote.indexOf("day");

while(value !== -1) {
    count++;
    value = newQuote.indexOf("day", value + 1);
}

console.log(count);



const text = "cat dog cat bird cat cat dog cat bird cat cat dog cat bird cat cat dog cat bird cat cat dog cat bird cat";

let count1 = 0;
let value1 = text.indexOf("cat");

while (value1 !== -1) {
    count1++;
    value1 = text.indexOf("cat", value1 + 1);
}

console.log(count1);


console.log("-----------------Objects-----------------------");

 
const person1= {
  name: "Rajashree",
  age:  23,
  job:  "QA Engineer",
  city : "",

  greet : function(){  // methods inside object
    console.log("Hello i am " + this.name )
},
getAge : function() {
    return this.age;
},

Address : {      //Oject inside an object(Nested Object)
    city1 : "Banlore",
    state : "Karnataka",
    pin : 560001
},
 skills: ["Playwright", "Manual Testing", "JIRA"]
}

console.log(person1.name);
console.log(person1.age);
console.log(person1.job);

const persson2 = "name"
console.log(person1[persson2]);

person1.age = 34;
console.log(person1.age);

//person1.city = "Bangalore";
//console.log(person1.city);

//delete person1.name;
//console.log(person1.name);

console.log(person1.greet());
console.log(person1.getAge());

console.log(person1.Address.city1)   // Bangalore
console.log(person1.Address.pin)    // 560001
console.log(person1.skills[0])
console.log(person1.skills[1])

console.log("name" in person1)
console.log("pop" in person1)

console.log(person1.city === undefined)

console.log("------------------------------")
console.log(Object.keys(person1));
console.log("------------------------------")
console.log(Object.values(person1));
console.log("------------------------------")
console.log(Object.entries(person1));


console.log("------------------------------")
/*class Person2 {
  name2: any;
  age2:  any;

  constructor(name2: any, age2: any) {
    this.name2 = name2   // ✅ matches parameter name2
    this.age2  = age2    // ✅ matches parameter age2
  
  }
}
const person2 = new Person2("Rajashree", 23)*/

const people = {name : "rAJASHREE", age : 24}
const extra = {city: "Bangalore", job: "QA"}

const peoplecopy = {...people}
console.log(peoplecopy)

const full = {...people,...extra}
console.log(full)


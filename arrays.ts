//fillter 
/*let numbers = [10, 15, 20, 25, 30];
let evenNumbers = numbers.filter(num => num % 2 === 0);

console.log(evenNumbers);*/

 //map()
let numbers = [1,2,4,5,7,7];
let result1 = numbers.map(num => num*3);
console.log(result1);

let numbers1 = [10,34,20];
let total1 = numbers1.reduce((sum,num)=> sum + num , 0);
console.log(total1);


console.log("-----------------------------");
const orders = [
    { id: "ORD101", status: "success" },
    { id: "ORD102", status: "failed" },
    { id: "ORD103", status: "success" }
];

const failedOrders = orders.filter(order => order.status === 'failed');
console.log(failedOrders);
const orderIds = orders.map(order => order.id);
console.log(orderIds);
console.log(orderIds.includes("ORD102"));

console.log("-----------------------------");

const users = [
    { name: "Raj", active: true },
    { name: "Anu", active: false },
    { name: "Rahul", active: true }
];

const activeUsers = users
.filter(user => user.active)
.map(user => user.name);
console.log("active users:",activeUsers);

const numbers2 = [5, 2, 10, 1, 20];
numbers2.sort((a,b)=>b-a);
console.log(numbers2);

console.log("-----------------------------");


const expenses = [300, 45, 622, 34, 7000];

// 1. Total
const total = expenses.reduce((sum, expense) => {
    return sum + expense ;
}, 0);

// 2. Highest
const highest = Math.max(...expenses);

// 3. Lowest
const lowest = Math.min(...expenses);

console.log("Total:", total);
console.log("Highest:", highest);
console.log("Lowest:", lowest);


console.log("-----------------------------------");



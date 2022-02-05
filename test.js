const log = [
    { a: 0, b: 1, c: 2 },
    { a: 1, b: 2, c: 3 },
    { a: 2, b: 3, c: 4 },
];
/* 
const transitions = [
    { a: 0, b: 1, c: 2 },
    { a: 1, b: 1, c: 2 },
    { a: 1, b: 2, c: 2 },
    { a: 1, b: 2, c: 3 },
    { a: 2, b: 2, c: 3 },
    { a: 2, b: 3, c: 3 },
    { a: 2, b: 3, c: 4 },
];
 */
let a, b, c = null;
const transitions = [];

for (const transition of log) {
    // a = transition["a"];
    // b = transition["b"];
    // c = transition["c"];

    console.log(Object.values(transition));
    console.log(Object.keys(transition));


}

const word = "###BPBPVVEPE#";
const wordArray = Array.from(word);
const blank = "#";
console.log(wordArray)


const firstChar = (element) => element != blank;

// console.log(wordArray.findIndex(firstChar));


console.log(word.slice(wordArray.findIndex(firstChar)))
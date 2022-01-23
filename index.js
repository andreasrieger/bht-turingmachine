/**
 * Turing machine simulation
 * 
 * @Author: Andreas Rieger, s82456@bht-berlin.de
 * Date: 2022-01-23
 */

const
    // The given aplphabet sigma
    sigma = ['B', 'E', 'P', 'S', 'T', 'V', 'X'],

    // Some proven reber words for testing purposes
    proven = [
        ['B', 'P', 'B', 'P', 'V', 'V', 'E', 'P', 'E'],
        ['B', 'T', 'B', 'T', 'S', 'S', 'X', 'X', 'T', 'V', 'V', 'E', 'T', 'E'],
        ['B', 'T', 'B', 'T', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E'],
        ['B', 'P', 'B', 'P', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'V', 'E', 'P', 'E'],
        ['B', 'T', 'B', 'T', 'S', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E']
    ]
    ;

/**
* This method returns a random number between min and max.
* 
* @param {*} min 
* @param {*} max 
* @returns 
*/
const randomInt = async (min, max) => {
    return (
        Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
        Math.ceil(min)
    )
};


/**
 * This method returns a random selection of a 
 * random number of words (chars) from sigma.
 * 
 * @param {*} abc 
 * @returns 
 */
const randomSequence = async () => {
    // To do: set min and max
    const
        n = sigma.length,
        arr = [],
        x = await randomInt(5, 10);

    for (let i = 0; i < x; i++) {
        arr.push(sigma[(0 + Math.floor(Math.random() * n)) % n]);
    }
    return arr;
};

/**
 * Method to create a new Turingmachine class object from whether
 * a list of proven words or a randomly created word based on sigma.
 * 
 * @param {*} proof 
 * @returns an object with the word, the machine's decision and a log
 */
const tm = async (proof) => {
    if (proof) {
        return new Turingmachine(proven[await randomInt(0, proven.length - 1)].join(''));
    } else {
        return new Turingmachine((await randomSequence()).join(''));
    }
};


/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {

    console.log("DOM fully loaded and parsed");

    document.getElementById("startButton").addEventListener("click", async () => {
        console.log((await tm(true)))
    })
})
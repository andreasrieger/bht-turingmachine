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


const getProofSequence = async () => {
    return proven[await randomInt(0, proven.length - 1)].join('');
};

const getRandomSequence = async () => {
    return (await randomSequence()).join('');
};


const nodeData = (states) => {
    const arr = [];
    const graphIds = [];
    let graphId = null;

    for (let i = 0, l = states.length; i < l; i++) {

        if (i != graphId && !graphIds.includes(i)) {
            if (i == 0) {
                arr.push({ key: i, color: "green" });
                graphIds.push(i);
            }
            if (!graphIds.includes(i)) {
                arr.push({ key: i, color: "grey" });
                graphIds.push(i);
            }
            graphId = i;
        }
    }
    return arr;
};


const linkData = (states) => {
    const arr = [];
    for (let i = 0, l = states.length; i < l; i++) {
        for (const key of Object.entries(states[i])) {
            const label = `[${key[0]}, ${key[1][0]}, ${key[1][1]}]`;
            const linkKey = i.toString() + key[1][2].toString();
            arr.push({ from: i, to: key[1][2], key: linkKey, label: label });
        }
    }
    return arr;
};


const transitionList = async (log) => {
    const arr = [];
    arr.push({ from: log[0]["curState"], to: log[0]["curState"], key: `${log[0]["curState"]}${log[0]["curState"]}`, head: log[0]["head"], write: log[0]["read"] });

    for (const transition of log) {
        const key = `${transition["curState"]}${transition["nextState"]}`;
        arr.push({ from: transition["curState"], to: transition["nextState"], key: key, head: transition["head"], write: transition["write"] });
    }
    return arr;
};

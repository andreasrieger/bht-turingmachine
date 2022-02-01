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
    /* proven = [
        ['B', 'P', 'B', 'P', 'V', 'V', 'E', 'P', 'E'],
        ['B', 'T', 'B', 'T', 'S', 'S', 'X', 'X', 'T', 'V', 'V', 'E', 'T', 'E'],
        ['B', 'T', 'B', 'T', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E'],
        ['B', 'P', 'B', 'P', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'V', 'E', 'P', 'E'],
        ['B', 'T', 'B', 'T', 'S', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E']
    ] */
    proven = [
        ['B', 'U', 'P', 'B', 'P', 'V', 'V', 'E', 'P', 'E', 'U'],
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


const nodeData = (log) => {

    // console.log(log);
    const arr = [];
    const graphIds = [];
    let graphId = null;

    for (const state of log) {
        const tempGraphId = state["curState"];

        if (tempGraphId != graphId) {
            let obj = null;
            if (tempGraphId == 0) {
                obj = { key: tempGraphId, color: "green" };
                arr.push(obj);
                graphIds.push(tempGraphId);
            } else if (tempGraphId > 0 && !graphIds.includes(tempGraphId)) {
                obj = { key: tempGraphId, color: "grey" };
                arr.push(obj);
                graphIds.push(tempGraphId);
            }

            // To do: check if nextState (log entry) is available, if not create node "?"
            // else if ()


            graphId = tempGraphId;
        }
    }
    return arr;
};

const linkData = (log) => {
    const arr = [];
    let linkId = null;

    for (const state of log) {
        const tempLinkId = `${state["curState"]}${state["nextState"]}`;
        if (tempLinkId != linkId) {
            const label = `[${state["read"]}, ${state["write"]}, ${state["move"]}]`;
            arr.push({ from: state["curState"], to: state["nextState"], key: tempLinkId, text: label, color: "white" });
            linkId = tempLinkId;
        }
    }
    return arr;
};

const transitionList = (log) => {
    const arr = [];
    for (const transition of log) {
        const key = `${transition["curState"]}${transition["nextState"]}`;
        arr.push({ from: transition["curState"], to: transition["nextState"], key: key, head: transition["head"] });
    }
    return arr;
};





async function init() {

    const res = await tm(true);

    const states = res["states"];
    console.log(states)

    const word = res["word"];
    console.log(word)

    const log = res["log"];
    
    let nodes = null;
    const nextState = log[log.length - 1]["nextState"];
    
    if (nextState != states.length - 1) {
        const read = word[log.length];
        log.push({ curState: nextState, head: log.length, read: read, write: '?', move: 'N', nextState: '?' });
        nodes = nodeData(log);
        nodes.push({ key: '?', color: "grey" });
    }
    
    console.log(log)

    const links = linkData(log);
    console.log(links)
    
    const transitions = transitionList(log);
    console.log(transitions)

    // init diagram
    const diagram = initDiagram(nodes, links);

    // delayedOutput(diagram, states.length, transitions, 1);

}


/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    init();
})

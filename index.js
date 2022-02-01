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
        ['B', 'P', 'B', 'P', 'V', 'V', 'E', 'P', 'E'] // correct word except last char
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



/*
The following lines need to be re-factored
*/


/**
 * Extracting the log data for node creation in the diagram. Every node is representing a state.
 *   
 * @param {*} log 
 * @returns 
 */
const nodeData = (log) => {

    const arr = [];
    const graphIds = [];
    let graphId = null;

    for (const state of log) {
        const tempGraphId = state["curState"];

        if (tempGraphId != graphId) {

            if (tempGraphId == 0) { // first node is green
                arr.push({ key: tempGraphId, color: "green" });
                graphIds.push(tempGraphId);
            }

            else if (tempGraphId > 0 && !graphIds.includes(tempGraphId)) {
                arr.push({ key: tempGraphId, color: "grey" });
                graphIds.push(tempGraphId);
            }

            graphId = tempGraphId;
        }
    }

    return arr;
};


const nodeData2 = (states) => {
    const arr = [];
    const graphIds = [];
    let graphId = null;

    for (const state of states) {
        const tempGraphId = state["keys"];

        if (tempGraphId != graphId) {

            if (tempGraphId == 0) { // first node is green
                arr.push({ key: tempGraphId, color: "grey" });
                graphIds.push(tempGraphId);
            }

            else if (tempGraphId > 0 && !graphIds.includes(tempGraphId)) {
                arr.push({ key: tempGraphId, color: "grey" });
                graphIds.push(tempGraphId);
            }
            
            graphId = tempGraphId;
        }
    }
    console.log(arr);
    return arr;
};

/**
 * Extracting the log data for link creation in the diagram. Every link is representing a transition between two states.
 * 
 * @param {*} log 
 * @returns 
 */
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


const nextStep = (diagram, curState, nextState, head, prevHead, accState) => {



    //To do: check whether last node is an accepting state -> green else -> red

    //testing around
    // console.log(diagram.findLinkForData()); // returns: null
    // console.log(diagram.findLinksByExample()); // returns: null
    // console.log(diagram.findNodeForKey(curState)); //returns: overwhelming info
    // console.log(diagram.findNodeForKey(curState).findLinksConnected());
    // console.log(diagram.findNodeForKey(curState).findNodesConnected());
    // console.log(diagram.findNodeForKey(curState).findLinksOutOf());
    // console.log(diagram.findNodeForKey(curState).findLinksTo());



    const node = diagram.model.findNodeDataForKey(curState);
    // const next = diagram.model.findNodeDataForKey(nextState);// last one throws error due to nextState not existing

    diagram.startTransaction("coloring");
    if (node !== null) {
        diagram.model.setDataProperty(node, "color", "green");
        // diagram.model.setDataProperty(link, "color", "green");
    }
    diagram.commitTransaction("coloring");

    /*     if ((curState < (accState - 1)) && (nextState == null)) {
            console.log("Error")
            const tapeElement = document.getElementById("th" + head);
            tapeElement.classList.replace("bg-light", "bg-danger");
            tapeElement.classList.replace("text-dark", "text-white");
    
            const prevTapeElement = document.getElementById("th" + prevHead);
            prevTapeElement.classList.replace("bg-secondary", "bg-light");
            prevTapeElement.classList.replace("text-white", "text-dark");
        } */

    if (curState < (accState - 1)) {
        const tapeElement = document.getElementById("th" + head);
        tapeElement.classList.replace("bg-light", "bg-secondary");
        tapeElement.classList.replace("text-dark", "text-white");

        const prevTapeElement = document.getElementById("th" + prevHead);
        prevTapeElement.classList.replace("bg-secondary", "bg-light");
        prevTapeElement.classList.replace("text-white", "text-dark");
    }

    else if (curState == (accState - 1)) {
        const tapeElements = document.querySelectorAll(".tape-element");
        for (let i = 0, l = tapeElements.length; i < l; i++) {
            tapeElements[i].classList.replace("bg-light", "bg-success");
            tapeElements[i].classList.replace("bg-secondary", "bg-success");
            tapeElements[i].classList.replace("text-dark", "text-white");
        }
    }
};


const delayedOutput = (diagram, accState, transitions, delay) => {

    for (let i = 0, l = transitions.length; i < l; i++) {
        const delayTime = i * delay * 100;
        setTimeout(
            (dg, curState, nextState, head, prevHead, aS) => {
                nextStep(dg, curState, nextState, head, prevHead, aS);
            },
            delayTime,
            diagram, //diagram object
            transitions[i]["from"], //curState
            (i + 1 < l) ? transitions[i + 1]["from"] : null, //nextState
            transitions[i]["head"], //head
            (i > 0) ? transitions[i - 1]["head"] : 0, //prevHead
            accState //accepting state
        );
    }
};

const tapeOutput = word => {
    const output = document.createElement("p");
    for (let i = 0, l = word.length; i < l; i++) {
        const textWrap = document.createElement("i");
        textWrap.setAttribute("id", "th" + i);
        if (i == 0) {
            textWrap.setAttribute("class", "bg-secondary text-white tape-element");
        } else textWrap.setAttribute("class", "bg-light text-dark tape-element");
        const text = document.createTextNode(word[i]);
        textWrap.appendChild(text);
        output.appendChild(textWrap);
    }
    document.getElementById("tapeOutput").appendChild(output);
};



async function init() {

    // starting the machine with a random word 
    const res = await tm(true);

    /**
     * getting the log data
     */

    const states = res["states"];
    // console.log("states:");
    // console.log(states);

    const word = res["word"];
    // console.log("word:");
    // console.log(word);


    const log = res["log"];

    let nodes = null;
    const nextState = log[log.length - 1]["nextState"];


    // adding log entry to add a final node to the diagram that is representing the unknown state 
    if (nextState != states.length - 1) {
        const read = word[log.length];
        log.push({ curState: nextState, head: log.length, read: read, write: '?', move: 'N', nextState: '?' });
        nodes = nodeData(log);
        nodes.push({ key: '?', color: "grey" });
    }

    else nodes = nodeData(log);

    // console.log("log:");
    // console.log(log);

    // console.log("nodes:");
    // console.log(nodes);

    const links = linkData(log);
    // console.log("links:");
    // console.log(links);

    const transitions = transitionList(log);
    // console.log("transitions:")
    // console.log(transitions)


    // init tape
    tapeOutput(word);

    // init diagram
    // const diagram = initDiagram(nodes, links);
    const diagram = initDiagram(nodeData2(states), links);

    // starting animation
    delayedOutput(diagram, states.length, transitions, 1);

}


/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    init();
})

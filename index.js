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
            // console.log(`prev: ${graphId} -> cur/next: ${tempGraphId}`);
            let obj = null;
            if (tempGraphId == 0) {
                obj = { key: tempGraphId, color: "green", prev: graphId };
                console.log(obj);
                arr.push(obj);
                graphIds.push(tempGraphId);
            } else if (tempGraphId > 0 && !graphIds.includes(tempGraphId)) {
                // console.log(tempGraphId);
                obj = { key: tempGraphId, color: "grey", prev: graphId };
                console.log(obj);
                arr.push(obj);
                graphIds.push(tempGraphId);
                // } else obj = { key: tempGraphId, color: "grey", temp: state["read"], prev: graphId };
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


const nextStep = (diagram, curState, nextState, head, prevHead, delay) => {

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

    if (curState < 13) {
        const tapeElement = document.getElementById("th" + head);
        tapeElement.classList.replace("bg-light", "bg-secondary");
        tapeElement.classList.replace("text-dark", "text-white");

        const prevTapeElement = document.getElementById("th" + prevHead);
        prevTapeElement.classList.replace("bg-secondary", "bg-light");
        prevTapeElement.classList.replace("text-white", "text-dark");
    }

    else if (curState == 13) {
        const tapeElements = document.querySelectorAll(".tape-element");
        for (let i = 0, l = tapeElements.length; i < l; i++) {
            tapeElements[i].classList.replace("bg-light", "bg-success");
            tapeElements[i].classList.replace("bg-secondary", "bg-success");
            tapeElements[i].classList.replace("text-dark", "text-white");
        }
    }


};


const delayedOutput = (diagram, states, transitions, delay) => {

    for (let i = 1, l = transitions.length; i < l; i++) {
        const delayTime = i * delay * 100;
        setTimeout(
            (dg, t1, t2, h1, h2, dt) => {
                nextStep(dg, t1, t2, h1, h2, dt)
            },
            delayTime,
            diagram,
            transitions[i]["from"],
            (i + 1 < l) ? transitions[i + 1]["from"] : null,
            // (i + 1 < l) ? states[i + 1]["key"] : null,
            transitions[i]["head"],
            transitions[i - 1]["head"],
            delayTime
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

/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {

    console.log("DOM fully loaded and parsed");

    document.getElementById("startButton").addEventListener("click", async () => {

        //To do: build the whole thing app centric!

        const response = await tm(true);
        tapeOutput(response["word"]);

        console.log(response["log"]);

        const nodes = nodeData(response["log"]);
        console.log(nodes);

        const links = linkData(response["log"]);
        // console.log(links);

        // init diagram
        const diagram = init(nodes, links);//BUg: sometimes delivers more nodes

        const transitions = transitionList(response["log"]);
        // output control
        delayedOutput(diagram, nodes, transitions, 1);

    })
})
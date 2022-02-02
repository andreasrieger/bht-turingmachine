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
        ['B', 'P', 'B', 'P', 'V', 'V', 'E', 'P', 'E', 'U'],
        ['B', 'T', 'B', 'T', 'S', 'S', 'X', 'X', 'T', 'V', 'V', 'E', 'T', 'E', 'U'],
        ['B', 'T', 'B', 'T', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E', 'U'],
        ['B', 'P', 'B', 'P', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'V', 'E', 'P', 'E', 'U'],
        ['B', 'T', 'B', 'T', 'S', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E', 'U']
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


const transitionList = (log) => {
    const arr = [];
    arr.push({ from: log[0]["curState"], to: log[0]["curState"], key: `${log[0]["curState"]}${log[0]["curState"]}`, head: log[0]["head"], write: log[0]["read"] });

    for (const transition of log) {
        const key = `${transition["curState"]}${transition["nextState"]}`;
        arr.push({ from: transition["curState"], to: transition["nextState"], key: key, head: transition["head"], write: transition["write"] });
    }
    return arr;
};


const nextStep = (diagram, curState, nextState, head, prevHead, write, accState) => {


    //To do: check whether last node is an accepting state -> green else -> red

    //testing around
    // console.log(diagram.findLinkForData()); // returns: null
    // console.log(diagram.findLinksByExample()); // returns: null
    // console.log(diagram.findNodeForKey(curState)); //returns: overwhelming info
    // console.log(diagram.findNodeForKey(curState).findLinksConnected());
    // console.log(diagram.findNodeForKey(curState).findNodesConnected());
    // console.log(diagram.findNodeForKey(curState).findLinksOutOf());
    // console.log(diagram.findNodeForKey(curState).findLinksTo());



    const node = diagram.model.findNodeDataForKey(nextState);
    // console.log(node.data.text)
    // const next = diagram.model.findNodeDataForKey(nextState);// last one throws error due to nextState not existing

    diagram.startTransaction("coloring");
    if (node !== null) {
        diagram.model.setDataProperty(node, "color", "green");
        // diagram.model.setDataProperty(link, "color", "green");
    }
    diagram.commitTransaction("coloring");



    if (curState == 0 && prevHead == 0) {
        const tapeElement = document.getElementById("th" + head);
        tapeElement.classList.replace("bg-light", "bg-secondary");
        tapeElement.classList.replace("text-dark", "text-white");
        tapeElement.innerText = write;
    }

    else if (curState < (accState - 1)) {
        const tapeElement = document.getElementById("th" + head);
        tapeElement.classList.replace("bg-light", "bg-secondary");
        tapeElement.classList.replace("text-dark", "text-white");
        tapeElement.innerText = write;

        const prevTapeElement = document.getElementById("th" + prevHead);
        prevTapeElement.classList.replace("bg-secondary", "bg-light");
        prevTapeElement.classList.replace("text-white", "text-dark");
    }

    else if (curState == (accState - 1) && curState == nextState){
        console.log("Bingo!")
        const tapeElement = document.getElementById("th" + head);
        tapeElement.classList.replace("bg-light", "bg-secondary");
        tapeElement.classList.replace("text-dark", "text-white");
        tapeElement.innerText = write;

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

/**
 * Trying to find link references
 */
const findLinksTest = (diagram) => {
    var allNodesIt = diagram.nodes;
    var nodeLinkStr = "";
    while (allNodesIt.next()) {
        var node = allNodesIt.value;
        nodeLinkStr += node.data.text; //node text
        var linkIt = node.findLinksOutOf(); // get all links out from it
        while (linkIt.next()) { // for each link get the link text and toNode text
            var link = linkIt.value;
            nodeLinkStr += link.data.text;
            nodeLinkStr += link.toNode.data.text;
        }
    }
    // console.log(allNodesIt)
    // console.log(nodeLinkStr)
};



const delayedOutput = (diagram, accState, transitions) => {

    findLinksTest(diagram);

    const delay = document.getElementById("animationInterval").value;

    for (let i = 0, l = transitions.length; i < l; i++) {
        const delayTime = i * delay * 200;
        const foo = setTimeout(
            (dg, curState, nextState, head, prevHead, write, aS) => {
                nextStep(dg, curState, nextState, head, prevHead, write, aS);
            },
            delayTime,
            diagram, //diagram object
            transitions[i]["from"], //curState
            transitions[i]["to"], //nextState
            // (i + 1 < l) ? transitions[i + 1]["from"] : null, //nextState
            transitions[i]["head"], //head
            (i > 0) ? transitions[i - 1]["head"] : 0, //prevHead
            transitions[i]["write"],
            accState //accepting state
        );
        console.log(foo);
    }
};


// start testing timeouts

function setDeceleratingTimeout(callback, factor, times) {
    var internalCallback = function (tick, counter) {
        return function () {
            if (--tick >= 0) {
                window.setTimeout(internalCallback, ++counter * factor);
                callback();
            }
        }
    }(times, 0);
    window.setTimeout(internalCallback, factor);
};


let interval = 1000 * document.getElementById("animationInterval").value;
// let run = setInterval(request, interval); // start setInterval as "run"

function request() {
    console.log(interval); // firebug or chrome log
    clearInterval(run); // stop the setInterval()
    run = setInterval(request, interval); // start the setInterval()
}

// end testing timeout


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
    const transitions = transitionList(res["log"]);

    // init tape
    tapeOutput(res["word"]);

    // init diagram
    const diagram = initDiagram(nodeData(res["states"]), linkData(res["states"]));

    // starting animation
    delayedOutput(diagram, res["states"].length, transitions);

    document.getElementById("startButton").addEventListener("click", () => {
        request();
    });

    document.getElementById("stopButton").addEventListener("click", () => {
        clearInterval(run)
    });

}


/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    init();
})

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

const intervalFactor = 100;
let response, diagram, transitions, intervalId, accState = null;
let interval = intervalFactor * document.getElementById("animationInterval").value;
let counter = 0;


const nextStep = (curState, nextState, head, prevHead, write) => {

    const accState = response["states"].length;

    //To do: check whether last node is an accepting state -> green else -> red

    //testing around
    // console.log(diagram.findLinkForData()); // returns: null
    // console.log(diagram.findLinksByExample()); // returns: null
    // console.log(diagram.findNodeForKey(curState)); //returns: overwhelming info
    // console.log(diagram.findNodeForKey(curState).findLinksConnected());
    // console.log(diagram.findNodeForKey(curState).findNodesConnected());
    // console.log(diagram.findNodeForKey(curState).findLinksOutOf());
    // console.log(diagram.findNodeForKey(curState).findLinksTo());



    diagramOutputControl(nextState);


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

    else if (curState == (accState - 1) && curState == nextState) {
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
const findLinksTest = () => {
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



const delayedOutput = (transitions) => {

    findLinksTest(diagram);

    const delay = document.getElementById("animationInterval").value;

    for (let i = 0, l = transitions.length; i < l; i++) {
        const delayTime = i * delay * 200;
        setTimeout(
            (curState, nextState, head, prevHead, write) => {
                nextStep(curState, nextState, head, prevHead, write);
            },
            delayTime,
            transitions[i]["from"], //curState
            transitions[i]["to"], //nextState
            // (i + 1 < l) ? transitions[i + 1]["from"] : null, //nextState
            transitions[i]["head"], //head
            (i > 0) ? transitions[i - 1]["head"] : 0, //prevHead
            transitions[i]["write"]
        );
        // if (i == l) console.log(response["accepted"]);
    }
};

const diagramOutputControl = nextState => {
    const node = diagram.model.findNodeDataForKey(nextState);
    diagram.startTransaction("coloring");
    if (node !== null) {
        diagram.model.setDataProperty(node, "color", "green");
    }
    diagram.commitTransaction("coloring");
};


const tapeOutputControl = (elem, curVal, newVal, newText) => {
    elem.classList.replace(curVal, newVal).innerText = newText;
    // elem.innerText = newText;
};


const stageOutputNextFrame = () => {
    const
        curState = transitions[counter]["from"],
        nextState = transitions[counter]["to"],
        head = transitions[counter]["head"],
        prevHead = (counter > 0) ? transitions[counter - 1]["head"] : 0,
        write = transitions[counter]["write"]
        ;

    if (counter < transitions.length-1) {

        diagramOutputControl(nextState); // diagram output

        // tape output
        if (curState == 0 && prevHead == 0) {
            const tapeElement = document.getElementById("th" + head);
            tapeOutputControl(tapeElement, "bg-light", "bg-secondary", write);
            tapeOutputControl(tapeElement, "text-dark", "text-white", write);

            tapeElement.innerText = write;
        }

        else if (curState < (accState - 1)) {
            const tapeElement = document.getElementById("th" + head);
            tapeOutputControl(tapeElement, "bg-light", "bg-secondary", write);
            tapeOutputControl(tapeElement, "text-dark", "text-white", write);

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

        else if (curState == (accState - 1) && curState == nextState) {
            const tapeElement = document.getElementById("th" + head);
            tapeElement.classList.replace("bg-light", "bg-secondary");
            tapeElement.classList.replace("text-dark", "text-white");
            tapeElement.innerText = write;

            const prevTapeElement = document.getElementById("th" + prevHead);
            prevTapeElement.classList.replace("bg-secondary", "bg-light");
            prevTapeElement.classList.replace("text-white", "text-dark");
        }

        counter++;
        console.log(counter)
    }

    else {
        clearInterval(intervalId);
        enableAllButtons();
    }
};


const tapeOutput = word => {
    const tapeWrap = document.getElementById("tapeOutput");
    tapeWrap.innerHTML = "";

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
    tapeWrap.appendChild(output);
};


const checkInputValue = inputValue => {
    if (inputValue.length != 0) {
        document.getElementById("launchDiagram").removeAttribute("disabled");
    } else document.getElementById("launchDiagram").setAttribute("disabled", "");
};


const enableAllButtons = () => {
    const disabledButtons = document.querySelectorAll("button");
    for (const button of disabledButtons) {
        if (button.hasAttribute("disabled")) {
            button.removeAttribute("disabled");
        }
    }
};

const disableEnable = element => {
    if (!element.hasAttribute("disabled")) {
        element.disabled = true;
    } else element.removeAttribute("disabled");
};

/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    enableAllButtons();

    const launchButton = document.getElementById("launchDiagram");

    launchButton.addEventListener("click", async function () {

        if (typeof diagram !== "undefined") {
            diagram.div = null;
            // diagram.model.clear();
        }

        const inputValue = document.getElementById("formControl1").value;
        if (inputValue.length != 0) {
            response = new Turingmachine(inputValue.toUpperCase());
            accState = response["states"].length;
            transitions = await transitionList(response["log"]);
            console.log(transitions.length)

            // init diagram
            diagram = initDiagram(nodeData(response["states"]), linkData(response["states"]));

            // init tape
            tapeOutput(response["word"]);
        }
        disableEnable(this);
    });

    document.getElementById("inlineRadio1").addEventListener("input", async () => {
        const inputValue = await getProofSequence();
        document.getElementById("formControl1").value = inputValue;
        checkInputValue(inputValue);
    });

    document.getElementById("inlineRadio2").addEventListener("input", async () => {
        const inputValue = await getRandomSequence();
        document.getElementById("formControl1").value = inputValue;
        checkInputValue(inputValue);
    });

    document.getElementById("formControl1").addEventListener("input", async () => {
        const inputValue = document.getElementById("formControl1").value;
        checkInputValue(inputValue);
    });


    document.getElementById("stopButton").addEventListener("click", function () {
        clearInterval(intervalId);
        enableAllButtons();
    });


    document.getElementById("nextButton").addEventListener("click", () => {
        stageOutputNextFrame();
    });


    // starting animation
    document.getElementById("startButton").addEventListener("click", async function () {
        disableEnable(this);
        intervalId = setInterval(stageOutputNextFrame, interval);
    });


    document.getElementById("animationInterval").addEventListener("input", () => {
        interval = intervalFactor * document.getElementById("animationInterval").value;
        const outputValue = document.getElementById("animationInterval").value + " Sekunde(n)";
        document.getElementById("animationIntervalOutput").innerText = outputValue;
    })

})

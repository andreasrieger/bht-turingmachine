/**
 * Turing machine simulation
 *
 * @Author: Andreas Rieger, s82456@bht-berlin.de
 * Date: 2022-01-23, updated: 2022-02-05
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


const intervalFactor = 100; // animation speed
let response, diagram, transitions, intervalId, accState = null;
let interval = intervalFactor * document.getElementById("animationInterval").value;
let counter = 0;


// activating output stage
const activateStageElements = () => {
    tapeWrapResetColor();
    tapeWrapSetColor("border-primary");
    statusOutputSetColor("border-primary");
    diagramOutputSetColor("border-primary");
    // stage-element
};


// tape output
const tapeSetActive = head => {
    // console.log("tapeSetActive")
    const elem = document.getElementById("th" + head);
    elem.classList.replace("bg-light", "bg-secondary");
    elem.classList.replace("text-dark", "text-white");
};


const tapeSetInactive = head => {
    // console.log("tapeSetInactive")
    const elem = document.getElementById("th" + head);
    elem.classList.replace("bg-secondary", "bg-light");
    elem.classList.replace("text-white", "text-dark");
};


const tapeSetError = head => {
    const elem = document.getElementById("th" + head);
    elem.classList.replace("bg-secondary", "bg-danger");
    elem.classList.replace("bg-light", "bg-danger");
    elem.classList.replace("text-dark", "text-white");
    tapeWrapSetColor("border-danger");
};


const tapeSetSuccess = () => {
    const elem = document.querySelectorAll(".tape-element");
    for (let i = 0, l = elem.length; i < l; i++) {
        elem[i].classList.replace("bg-light", "bg-success");
        elem[i].classList.replace("bg-secondary", "bg-success");
        elem[i].classList.replace("text-dark", "text-white");
    }
    tapeWrapSetColor("border-success");
};


const tapeReset = () => {
    const elem = document.querySelectorAll(".tape-element");
    for (let i = 0, l = elem.length; i < l; i++) {
        elem[i].classList.remove("bg-success", "bg-secondary", "bg-success", "text-white");
        elem[i].classList.add("bg-light", "text-dark");
    }
    tapeWrapResetColor();
};


const tapeWrapSetColor = color => {
    const elem = document.getElementById("tapeOutputWrap");
    elem.classList.remove("border-danger", "border-success");
    elem.classList.add(color);
};


const tapeWrapResetColor = () => {
    const elem = document.getElementById("tapeOutputWrap");
    elem.classList.remove("border-danger", "border-success", "border-primary");
};


const tapeWrite = (head, write) => {
    const elem = document.getElementById("th" + head);
    elem.innerText = write;
};


// status output
const statusOutputSetColor = color => {
    const nodes = document.querySelectorAll(".status-output");
    for (const node of nodes) {
        node.classList.remove("border-danger", "border-success");
        node.classList.add(color);
    }
};


const statusStateOutput = curState => {
    const elem = document.getElementById("stateOutput");
    elem.innerText = curState;
};


const statusWriteOutput = write => {
    const elem = document.getElementById("writeOutput");
    elem.innerText = write;
};


const statusReadOutput = read => {
    const elem = document.getElementById("readOutput");
    elem.innerText = read;
};


const statusMoveOutput = move => {
    const elem = document.getElementById("moveOutput");
    elem.innerText = move;
};


// diagram output
const diagramOutputSetColor = color => {
    const elem = document.getElementById("diagramOutput");
    elem.classList.remove("border-danger", "border-success");
    elem.classList.add("border", color);
};


const stageOutputNextFrame = () => {
    const
        transition = transitions[counter],
        curState = transition["from"],
        nextState = transition["to"],
        head = transition["head"],
        nextHead = (counter < transitions.length - 1) ? transitions[counter + 1]["head"] : transition["head"],
        read = transition["read"],
        nextRead = (counter < transitions.length - 1) ? transitions[counter + 1]["read"] : transition["read"],
        write = transition["write"],
        nextWrite = (counter < transitions.length - 1) ? transitions[counter + 1]["write"] : transition["write"],
        move = transition["move"],
        nextMove = (counter < transitions.length - 1) ? transitions[counter + 1]["move"] : transition["move"],

        first = Math.ceil(interval / 3),
        second = Math.ceil((interval / 3) * 2)
        ;

    if (head < response["word"].length) {

        // tape output
        tapeSetActive(nextHead);
        tapeSetInactive(head);
        tapeWrite(head, write);

        // configuration output
        statusStateOutput(nextState);
        statusReadOutput(nextRead);
        statusWriteOutput(nextWrite);
        statusMoveOutput(nextMove);

        if (counter == transitions.length - 1 && response["accepted"]) {
            initTapeOutput(response["word"]);
            tapeSetSuccess();
        }
        else if (counter == transitions.length - 1 && !response["accepted"]) {
            tapeSetError(nextHead);
        }
    }

    if (counter < transitions.length - 1) {
        counter++;

        // diagram output
        diagramSetInactive(curState);
        diagramSetActive(nextState);
    }

    else clearInterval(intervalId);
};


const diagramSetActive = state => {
    const node = diagram.model.findNodeDataForKey(state);
    diagram.startTransaction("coloring");
    if (node !== null) {
        diagram.model.setDataProperty(node, "color", "green");
    }
    diagram.commitTransaction("coloring");
};


const diagramSetInactive = state => {
    const node = diagram.model.findNodeDataForKey(state);
    diagram.startTransaction("coloring");
    if (node !== null) {
        diagram.model.setDataProperty(node, "color", "#75B798");
    }
    diagram.commitTransaction("coloring");
};


const initTapeOutput = word => {
    const tapeWrap = document.getElementById("tapeOutput");
    tapeWrap.innerHTML = "";
    const output = document.createElement("p");
    for (let i = 0, l = word.length; i < l; i++) {
        const textWrap = document.createElement("span");
        textWrap.setAttribute("id", "th" + i);
        if (i == 0) {
            textWrap.setAttribute("class", "bg-secondary text-white");
        } else textWrap.setAttribute("class", "bg-light text-dark");
        textWrap.classList.add("fs-1", "fw-bold", "font-monospace", "tape-element");
        const text = document.createTextNode(word[i]);
        textWrap.appendChild(text);
        output.appendChild(textWrap);
    }
    tapeWrap.appendChild(output);
};


const checkInputValue = inputValue => {
    if (inputValue.length != 0) {
        activateLaunchButton();
    } else deactivateLaunchButton();
};


const activateInputControl = () => {
    document.querySelector("#formControl1").classList.add("shadow");
};


const deactivateInputControl = () => {
    document.querySelector("#formControl1").classList.remove("shadow");
    const nodes = document.querySelectorAll(".input-control");
    for (const node of nodes) {
        node.disabled = true;
    }
};


const enableDisableInputControl = () => {
    const nodes = document.querySelectorAll(".input-control");
    for (const node of nodes) {
        node.disabled = !node.disabled;
    }
};


const activateLaunchButton = () => {
    const elem = document.querySelector("#launchButton");
    elem.classList.remove("btn-light");
    elem.classList.add("btn", "btn-primary");
    elem.disabled = false;
};


const deactivateLaunchButton = () => {
    const elem = document.querySelector("#launchButton");
    elem.disabled = true;
};


const enableOutputControl = () => {
    document.querySelector("#outputControlGroup").classList.add("shadow");
    const nodes = document.querySelectorAll(".output-control");
    for (const node of nodes) {
        node.disabled = false;
    }
};


const deactivateOuputControl = () => {
    document.querySelector("#outputControlGroup").classList.remove("shadow");
    const nodes = document.querySelectorAll(".output-control");
    for (const node of nodes) {
        node.disabled = true;
    }
};


// refactor both methods
const enableAllButtons = () => {
    const disabledButtons = document.querySelectorAll("button");
    for (const button of disabledButtons) {
        if (button.hasAttribute("disabled")) {
            button.removeAttribute("disabled");
        }
    }
};

const disableEnable = element => {
    element.disabled = !element.disabled; // alternative variant
    // if (!element.hasAttribute("disabled")) {
    //     element.disabled = true;
    // } else element.removeAttribute("disabled");
};


/**
 * General function initialization when the document is loaded
 */
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    // init tape output
    initTapeOutput(Array.from("Beispielwort".toUpperCase()));

    // init input control
    // activateInputControl();

    // launching the output
    const launchButton = document.querySelector("#launchButton");
    launchButton.addEventListener("click", async function () {

        // disabling controls
        disableEnable(this);
        disableEnable(document.querySelector("#resetButton"));
        deactivateInputControl();
        tapeWrapResetColor();
        tapeReset();

        // enabling controls
        enableOutputControl();
        activateStageElements();

        if (typeof diagram !== "undefined") {
            diagram.div = null;
            // diagram.model.clear();
        }

        const inputValue = document.getElementById("formControl1").value;
        if (inputValue.length != 0) {
            response = new Turingmachine(inputValue.toUpperCase());
            accState = response["states"].length;
            transitions = await transitionList(response["log"]);
            counter = 0;

            // init diagram
            diagram = initDiagram(nodeData(response["states"]), linkData(response["states"]));

            // init tape
            initTapeOutput(response["word"]);
        }
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
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        stageOutputNextFrame();
    });

    // starting animation
    document.getElementById("startButton").addEventListener("click", async function () {
        intervalId = setInterval(stageOutputNextFrame, interval);
    });

    document.getElementById("animationInterval").addEventListener("input", () => {
        interval = intervalFactor * document.getElementById("animationInterval").value;
        // const outputValue = document.getElementById("animationInterval").value + " Sekunde(n)";
        // document.getElementById("animationIntervalOutput").innerText = outputValue;
    })

    document.querySelector("#resetButton").addEventListener("click", function () {
        enableDisableInputControl();
        activateInputControl();
        activateLaunchButton();
        enableOutputControl();
        deactivateOuputControl();
        disableEnable(this);
    });

    document.querySelector("#introButton").addEventListener("click", () => {
        introJs().start();
    });
})

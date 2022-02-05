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
        // ['B', 'T', 'B', 'T', 'S', 'S', 'X', 'X', 'T', 'V', 'V', 'E', 'T', 'E'],
        // ['B', 'T', 'B', 'T', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E'],
        // ['B', 'P', 'B', 'P', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'P', 'X', 'V', 'V', 'E', 'P', 'E'],
        // ['B', 'T', 'B', 'T', 'S', 'X', 'X', 'V', 'P', 'S', 'E', 'T', 'E']
    ]
    ;

const intervalFactor = 100;
let response, diagram, transitions, intervalId, accState = null;
let interval = intervalFactor * document.getElementById("animationInterval").value;
let counter = 0;


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
    // console.log("tapeSetError")
    // console.log("head:" + head)
    const elem = document.getElementById("th" + head);
    elem.classList.replace("bg-secondary", "bg-danger");
    elem.classList.replace("bg-light", "bg-danger");
    elem.classList.replace("text-dark", "text-white");
};


const tapeSetSuccess = () => {
    const elem = document.querySelectorAll(".tape-element");
    for (let i = 0, l = elem.length; i < l; i++) {
        elem[i].classList.replace("bg-light", "bg-success");
        elem[i].classList.replace("bg-secondary", "bg-success");
        elem[i].classList.replace("text-dark", "text-white");
    }
};


const tapeWrite = (head, write) => {
    const elem = document.getElementById("th" + head);
    elem.innerText = write;
};


const stageOutputNextFrame = () => {

    const
        transition = transitions[counter],
        curState = transition["from"],
        nextState = transition["to"],
        head = transition["head"],
        nextHead = (counter < transitions.length - 1) ? transitions[counter + 1]["head"] : transition["head"],
        read = transition["read"],
        write = transition["write"],
        move = transition["move"],
        first = Math.ceil(interval / 3),
        second = Math.ceil((interval / 3) * 2)
        ;

    // console.log(`-- `)
    // console.log(`counter: ${counter}`)
    // console.log(`curState: ${curState}`)
    // console.log(`nextState: ${nextState}`)
    // console.log(`head: ${head}`)
    // console.log(`nextHead: ${nextHead}`)
    // console.log(`read: ${read}`)
    // console.log(`write: ${write}`)
    // console.log(`should move: ${move}`)




    if (head < response["word"].length) {
        console.log(counter, transitions.length, head, read, write)
        tapeSetActive(head);
        setTimeout(tapeWrite, first, head, write);

        if (head < response["word"].length - 1) {
            setTimeout(tapeSetInactive, second, head);
            setTimeout(tapeSetActive, second, nextHead);
        }

        if (counter == transitions.length - 1 && response["accepted"]) {
            tapeSetSuccess();
        }
        else if (counter == transitions.length - 1 && !response["accepted"]) {
            tapeSetError(nextHead);
        }
    }

    if (counter < transitions.length - 1) {
        counter++;
        diagramSetInactive(curState); // diagram output
        diagramSetActive(nextState); // diagram output
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
            counter = 0;
            console.log(response)
            console.log(transitions)

            // init diagram
            diagram = initDiagram(nodeData(response["states"]), linkData(response["states"]));

            // init tape
            initTapeOutput(response["word"]);
        }
        // disableEnable(this);

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
        console.log(this.id)
        intervalId = setInterval(stageOutputNextFrame, interval);
    });


    document.getElementById("animationInterval").addEventListener("input", () => {
        interval = intervalFactor * document.getElementById("animationInterval").value;
        const outputValue = document.getElementById("animationInterval").value + " Sekunde(n)";
        document.getElementById("animationIntervalOutput").innerText = outputValue;
    })

})

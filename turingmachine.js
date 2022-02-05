/**
 * Turing machine simulation
 *
 * @Author: Andreas Rieger, s82456@bht-berlin.de
 * Date: 2022-01-23, updated: 2022-02-04
 * /


/**
 * Machine configuration
 *
 * Every object represents a curState with different transitions.
 * Every transition consists of key (tape read) and 3 statements: write, moving direction and new curState.
 *
 */

const blank = '_'; // using the underscores ('_') instead of blanks / spaces (' ') for testing purpose

const states = [
    // curState 0
    {
        [blank]: [blank, 'R', 0],
        'B': [blank, 'R', 1]
    },
    // curState 1
    {
        'T': ['T', 'R', 2],
        'P': ['P', 'R', 2]
    },
    // curState 2
    {
        'B': [blank, 'R', 3]
    },
    // curState 3
    {
        'T': [blank, 'R', 4],
        'P': [blank, 'R', 6]
    },
    // curState 4
    {
        'S': [blank, 'R', 4],
        'X': [blank, 'R', 5]
    },
    // curState 5
    {
        'X': [blank, 'R', 6],
        'S': [blank, 'R', 8]
    },
    // curState 6
    {
        'T': [blank, 'R', 6],
        'V': [blank, 'R', 7]
    },
    // curState 7
    {
        'P': [blank, 'R', 5],
        'V': [blank, 'R', 8]
    },
    // curState 8
    {
        'E': [blank, 'R', 9]
    },
    // curState 9
    {
        'T': [blank, 'L', 10],
        'P': [blank, 'L', 11]
    },
    // curState 10
    {
        [blank]: [blank, 'L', 10],
        'T': [blank, 'R', 12]
    },
    // curState 11
    {
        [blank]: [blank, 'L', 11],
        'P': [blank, 'R', 12]
    },
    // curState 12
    {
        [blank]: [blank, 'R', 12],
        'E': [blank, 'R', 13]
    },
    // curState 13
    {
        [blank]: [blank, 'N', 13]
    }
];

/**
 * This class is defining a turing machine.
 * The class' constructor is expecting a word to work with.
 */
class Turingmachine {
    constructor(word) {

        // creating array from word
        const tape = Array.from(word.trim());

        // adding a blank to mark the end of word
        tape.push(blank);

        const firstChar = (element) => element != blank;
        this.word = tape.slice(tape.findIndex(firstChar))
        this.states = states;
        this.accepted = false;
        this.blank = blank;
        this.log = [];

        let
            curState = 0,
            nextState = 0,
            head = 0
            ;

        /**
         * Recursive method to control the machine's flow
         */
        const operations = () => {


            // making configuration details 
            // shorter and more readable
            const read = tape[head];

            // running through the configuration without errors 
            // while reading only valid chars from tape
            if (typeof states[curState][read] !== "undefined") {

                // making configuration details shorter and more readable
                const write = states[curState][read][0];
                const move = states[curState][read][1];
                nextState = states[curState][read][2];

                // Ignoring initial 'blanks' (#) and
                // moving the head to the first char without logging
                if (curState == 0 && tape[head] == blank) {
                    head++;
                    operations();
                }

                // moving head to the right
                else if (move == 'R') {
                    this.logResult(curState, head, read, write, move, nextState);
                    curState = nextState;
                    tape[head] = write;
                    head++;
                    operations();
                }

                // moving head to the left
                else if (move == 'L') {
                    this.logResult(curState, head, read, write, move, nextState);
                    curState = nextState;
                    tape[head] = write;
                    head--;
                    operations();
                }

                // reaching end of tape, succeeding
                else {
                    this.logResult(curState, head, read, write, move, nextState);
                    this.accepted = true;
                }

            }

            // leaving the loop while reading unknown char from tape 
            else {
                console.log(`unknown char ${read} at head pos. ${head} in state ${curState}`);
                this.logResult(curState, head, read, read, 'N', nextState);
            }





        }

        operations(); // starting program routine
    }

    /**
     * Logging state transition results
     * 
     * @param {*} curState 
     * @param {*} head 
     * @param {*} read 
     * @param {*} write 
     * @param {*} move 
     * @param {*} nextState 
     */
    logResult(curState, head, read, write, move, nextState) {
        this.log.push({
            curState: curState,
            head: head,
            read: read,
            write: write,
            move: move,
            nextState: nextState
        });
    }
}

/**
 * node test
 */
(() => {
    console.log("Test...");
    console.log(new Turingmachine("###BPBPVVEPE#"));
})()
/**
 * Turing machine simulation
 * 
 * @Author: Andreas Rieger, s82456@bht-berlin.de
 * Date: 2022-01-23
 * /
 

/**
 * Machine configuration
 * 
 * Every object represents a state with different transitions.
 * Every transition consists of key (tape read) and 3 statements: write, moving direction and new state.
 * 
 * Attention: For better monitoring the number sign (#) will be used instead of blanks (' ').
 */
const states = [
    // state 0
    {
        '#': ['#', 'R', 0],
        'B': ['#', 'R', 1]
    },
    // state 1
    {
        'T': ['T', 'R', 2],
        'P': ['P', 'R', 2]
    },
    // state 2
    {
        'B': ['#', 'R', 3]
    },
    // state 3
    {
        'T': ['#', 'R', 4],
        'P': ['#', 'R', 6]
    },
    // state 4
    {
        'S': ['#', 'R', 4],
        'X': ['#', 'R', 5]
    },
    // state 5
    {
        'X': ['#', 'R', 6],
        'S': ['#', 'R', 8]
    },
    // state 6
    {
        'T': ['#', 'R', 6],
        'V': ['#', 'R', 7]
    },
    // state 7
    {
        'P': ['#', 'R', 5],
        'V': ['#', 'R', 8]
    },
    // state 8
    {
        'E': ['#', 'R', 9]
    },
    // state 9
    {
        'T': ['#', 'L', 10],
        'P': ['#', 'L', 11]
    },
    // state 10
    {
        '#': ['#', 'L', 10],
        'T': ['#', 'R', 12]
    },
    // state 11
    {
        '#': ['#', 'L', 11],
        'P': ['#', 'R', 12]
    },
    // state 12
    {
        '#': ['#', 'R', 12],
        'E': ['#', 'R', 13]
    },
    // state 13
    {
        '#': ['#', 'N', 13]
    }
];

/**
 * This class is defining a turing machine.
 * The class' constructor is expecting a word to work with. 
 */
class Turingmachine {
    constructor(word) {

        this.word = word;
        this.states = states;
        this.accepted = false;
        this.log = [];
        const tape = [];
        const blank = '#';
        let
            state = 0,
            nextState = null,
            head = 0
            ;

        for (const char of word) {
            tape.push(char);
        }

        tape.push(blank)

        // console.log(tape)

        /**
         * Recursive method to control the machine's flow
         */
        const operations = () => {

            const read = tape[head];

            // Ignoring initial 'blanks' (#) and 
            // moving the head to the first letter without logging
            // using .trim() if ' '
            if (state == 0 && read == blank) {
                head++;
                operations();
            }

            else if (typeof states[state][read] !== "undefined") {

                const write = states[state][read][0];
                const move = states[state][read][1];
                nextState = states[state][read][2];

                // console.log(`current state: ${state} -> read: ${read}, write: ${write}, move: ${move}, next state: ${nextState} `)

                this.log.push({
                    curState: state,
                    head: head,
                    read: read,
                    write: write,
                    move: move,
                    nextState: nextState
                })

                if (move == 'R' && !this.accepted) {
                    tape[head] = write;
                    state = nextState;
                    head++;
                    operations();
                }

                else if (move == 'L' && !this.accepted) {
                    state = nextState;
                    tape[head] = write;
                    head--;
                    operations();
                }
                
                else if (move == 'N') {
                    this.accepted = true;
                }
            }
        }

        operations(); // starting program routine
    }
}

/**
 * node test
 */
(() => {
    console.log("Test...");
    console.log(new Turingmachine("###BPBPVVEPE"));
})()
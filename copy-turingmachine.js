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
 */

const blank = '#'; // using the number sign (#) instead of blanks (' ') for testing purpose

const states = [
    // state 0
    {
        // [blank]: [blank, 'R', 0],
        'B': [blank, 'R', 1]
    },
    // state 1
    {
        'T': ['T', 'R', 2],
        'P': ['P', 'R', 2]
    },
    // state 2
    {
        'B': [blank, 'R', 3]
    },
    // state 3
    {
        'T': [blank, 'R', 4],
        'P': [blank, 'R', 6]
    },
    // state 4
    {
        'S': [blank, 'R', 4],
        'X': [blank, 'R', 5]
    },
    // state 5
    {
        'X': [blank, 'R', 6],
        'S': [blank, 'R', 8]
    },
    // state 6
    {
        'T': [blank, 'R', 6],
        'V': [blank, 'R', 7]
    },
    // state 7
    {
        'P': [blank, 'R', 5],
        'V': [blank, 'R', 8]
    },
    // state 8
    {
        'E': [blank, 'R', 9]
    },
    // state 9
    {
        'T': [blank, 'L', 10],
        'P': [blank, 'L', 11]
    },
    // state 10
    {
        [blank]: [blank, 'L', 10],
        'T': [blank, 'R', 12]
    },
    // state 11
    {
        [blank]: [blank, 'L', 11],
        'P': [blank, 'R', 12]
    },
    // state 12
    {
        [blank]: [blank, 'R', 12],
        'E': [blank, 'R', 13]
    },
    // state 13
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

        this.word = word.trim();
        this.states = states;
        this.accepted = false;
        this.blank = blank;
        this.log = [];

        const tape = [];
        let
            state = 0,
            nextState = null,
            head = 0
            ;

        // splitting word and pushing chars to tape
        for (const char of word) {
            tape.push(char);
        }
        tape.push(blank);

        /**
         * Recursive method to control the machine's flow
         */
        const operations = () => {

            const read = tape[head];

            // Ignoring initial 'blanks' (#) and 
            // moving the head to the first char without logging
            if (state == 0 && read == blank) {
                head++;
                operations();
            }

            else if (typeof states[state][read] !== "undefined") {

                const write = states[state][read][0];
                const move = states[state][read][1];
                nextState = states[state][read][2];

                this.log.push({
                    curState: state,
                    head: head,
                    read: read,
                    write: write,
                    move: move,
                    nextState: nextState
                });

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

                
                // what happens from here?
                else if (move == 'N' && !this.accepted) {
                    this.accepted = true;
                    operations();
                }
            }

            // test
            else {
                this.log.push({
                    curState: state,
                    head: head,
                    read: read,
                    write: read,
                    move: 'N',
                    nextState: state
                });
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
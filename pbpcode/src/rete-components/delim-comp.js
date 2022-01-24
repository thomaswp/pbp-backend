import { Output, Input, Component } from "rete";
import { numSocket, listSocket, loopSocket, stringSocket, predicateSocket, boolSocket } from "./sockets";
import { NumControl, ListControl, CodeControl } from "../controls/controls";
import { Loop, ValueGenerator } from "../controls/objects";
import { BaseComponent, Accumulator } from './general-comp';

class DelimTestInput extends BaseComponent {
    constructor(){
        super("Delimeters Test Input");
    }

    getOutputData() {
        return [
            this.outputData('True Test', listSocket, true, false,
                ['<br>', '<br>', '</br>', '<br>', '</br>', '</br>']),
            this.outputData('False Test', listSocket, true, false,
                ['<br>', '</br>', '</br>', '<br>']),
        ];
    }
}

class CountDelimiters extends BaseComponent {

    constructor(name, test){
        super(name);
        this.test = test;
    }

    getInputData() {
        return [
            this.inputData('Loop', loopSocket),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Current Count', numSocket),
            this.outputData('Final Count', numSocket),
        ]
    }

    work(inputs) {
        const generators = new Accumulator(inputs.loop, 0, (currentValue, newValue, context) => {
            return currentValue + (this.test(newValue) ? 1 : 0);
        }).generators();
        return {
            current_count: generators.current_value,
            final_count: generators.final_value,
        };
    }

    // work(inputs) {
    //     const loop = inputs.loop, gen = inputs.value;
    //     let count = 0;
    //     if (loop) {
    //         loop.addStartHandler(() => count = 0);
    //         loop.addLoopHandler((v, i, context) => {
    //             const value = gen ? gen.get(context) : v;
    //             if (this.test(value)) count++;
    //             // console.log(id, sum, add);
    //         });
    //     }
    //     return {
    //         // TODO: Need to ensure loop on current too
    //         'current_count': new ValueGenerator(() => count, true),
    //         'final_count': new ValueGenerator((iter) => {
    //             if (!loop) return 0;
    //             loop.ensureRun(iter);
    //             if (loop.isFinished(iter)) return count;
    //             return Number.NaN;
    //         }),
    //     };
    // }
}

class CountOpenDelimiters extends CountDelimiters {
    constructor() {
        super("Count Open Delims", b => !b.includes('/'));
    }
}

class CountCloseDelimiters extends CountDelimiters {
    constructor() {
        super("Count Close Delims", b => b.includes('/'));
    }
}

class EnsureNeverGreater extends BaseComponent {

    constructor() {
        super('Ensure Always: Open \u2265 Close');
    }

    getInputData() {
        return [
            this.inputData('Loop', loopSocket),
            // TODO: Use scalar or updating loop generics
            this.inputData('Open', numSocket),
            this.inputData('Close', numSocket),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Currently Satisfied', boolSocket),
            this.outputData('Finally Satisfied', boolSocket),
        ]
    }

    work(inputs) {
        const open = inputs.open, close = inputs.close;
        const generators = new Accumulator(inputs.loop, true, (currentValue, newValue, context) => {
            if (!open || !close) return currentValue;
            // console.log(currentValue, close.get(context), open.get(context))
            return currentValue && close.get(context) <= open.get(context);
        }).generators();
        return {
            currently_satisfied: generators.current_value,
            finally_satisfied: generators.final_value,
        };
    }

    // work(inputs) {
    //     const loop = inputs.loop,
    //         open = inputs.open,
    //         close = inputs.close;
    //     let satisfied = true;
    //     if (loop) {
    //         loop.addStartHandler(() => satisfied = true);
    //         loop.addLoopHandler((v, i, context) => {
    //             if (!open || !close) return;
    //             if (close.get(context) > open.get(context)) satisfied = false;
    //         });
    //     }
    //     return new ValueGenerator((context) => {
    //         if (!loop) return true;
    //         loop.ensureRun(context);
    //         return satisfied;
    //     });
    // }
}

class EnsureEqual extends BaseComponent {

    constructor() {
        super('Ensure Open == Close');
    }

    getInputData() {
        return [
            // TODO: Use scalar or updating loop generics
            this.inputData('Open', numSocket),
            this.inputData('Close', numSocket),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Satisfied', boolSocket),
        ]
    }

    work(inputs) {
        return new ValueGenerator((context) => {
            const rInputs = this.reify(inputs, context);
            const open = rInputs.open;
            const close = rInputs.close;
            // TODO: Should create undefined type to return
            if (open === undefined || close === undefined) return false;
            return open == close;
        });
    }
}

export default [
    new DelimTestInput(),
    new CountOpenDelimiters(),
    new CountCloseDelimiters(),
    new EnsureNeverGreater(),
    new EnsureEqual(),
];
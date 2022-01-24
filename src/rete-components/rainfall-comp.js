import { Output, Input, Component } from "rete";
import { numSocket, listSocket, loopSocket, predicateSocket } from "./sockets";
import { NumControl, ListControl, CodeControl } from "../controls/controls";
import { Loop, ValueGenerator } from "../controls/objects";
import { BaseComponent } from "./general-comp";

class IfZeroComponent extends BaseComponent {
    constructor(){
        super("If Zero");
    }

    getInputData() {
        return [
            this.inputData('Number', numSocket),
            this.inputData('Then', numSocket, true, 0),
            this.inputData('Else', numSocket, true, 0),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Out', numSocket),
        ];
    }

    work(inputs) {
        return new ValueGenerator(context => {
            inputs = this.reify(inputs, context);
            return inputs.number == 0 ? inputs.then : inputs.else;
        })
    }
}

class TestInputComponent extends BaseComponent {
    constructor(){
        super("Test Input");
    }

    getOutputData() {
        return [
            this.outputData('Test', listSocket, true, false,
                [5, -3, 7, -200, 9, -999, 10]),
        ];
    }
}

class LoopUntilValue extends BaseComponent {
    constructor(){
        super("Loop Until Value");
    }

    getInputData() {
        return [
            this.inputData('List', listSocket, true),
            this.inputData('Stop', numSocket, true, -999),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Loop', loopSocket),
            this.outputData('Value', numSocket),
        ];
    }

    work(inputs) {
        let index;
        let loop = new Loop((context) => {
            const rInputs = this.reify(inputs, context);
            const list = rInputs.list;
            let i = 0;
            return () => {
                index = i;
                if (list[i] == rInputs.stop) return undefined;
                if (list && i < list.length) return list[i++];
                return undefined;
            }
        });
        let value = new ValueGenerator(() => index);
        return {
            loop,
            value,
        };
    }
}

export default [
    new TestInputComponent(),
    new LoopUntilValue(),
    new IfZeroComponent(),
];
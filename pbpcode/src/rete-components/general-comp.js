import { Output, Input, Component } from "rete";
import { numSocket, listSocket, loopSocket, predicateSocket, boolSocket } from "./sockets";
import { NumControl, ListControl, CodeControl } from "../controls/controls";
import { Loop, ValueGenerator } from "../controls/objects";

export class BaseComponent extends Component {

    static getKey(name, list) {
        let key = name.toLowerCase().replace(" ", "_");
        while (list.filter(k => k == key).length > 0) key += "_";
        return key;
    }

    static addKeys(data) {
        let keys = data.map(d => d.key).filter(k => !!k);
        data.forEach(d => {
            d.key = BaseComponent.getKey(d.name, keys);
        });
    }

    constructor(name) {
        super(name);
        this.inputData = this.getInputData();
        this.outputData = this.getOutputData();
        BaseComponent.addKeys(this.inputData);
        BaseComponent.addKeys(this.outputData);
    }

    // Begin abstract methods

    getInputData() {
        return [];
    }

    getOutputData() {
        return [];
    }

    work(inputs) { }

    // End abstract methods

    inputData(name, socket, hasControl = false, defaultValue) {
        return { name, socket, hasControl, defaultValue };
    }

    outputData(name, socket, hasControl = false, hasPreview = true, defaultValue) {
        return { name, socket, hasControl, hasPreview, defaultValue };
    }

    controlFromSocket(socket, key, readonly, defaultValue) {
        if (socket === numSocket) {
            if (readonly) {
                return new ListControl(this.editor, key, readonly, defaultValue);
            } else {
                return new NumControl(this.editor, key, readonly, defaultValue);
            }
        }
        if (socket === boolSocket) return new ListControl(this.editor, key, readonly, defaultValue);
        if (socket === listSocket) return new ListControl(this.editor, key, readonly, defaultValue);
        if (socket === loopSocket) return new ListControl(this.editor, key, readonly);
        throw new Error("No control for socket: " + typeof socket);
    }

    reify(inputs, context) {
        const newInputs = {};
        for (const [key, value] of Object.entries(inputs)) {
            if (value instanceof ValueGenerator) {
                newInputs[key] = value.get(context);
            } else {
                newInputs[key] = value;
            }
        }
        return newInputs;
    }

    _addInput(node, data) {
        const name = data.name, socket = data.socket, key = data.key;
        const input = new Input(key, name, socket);
        if (data.hasControl) {
            input.addControl(this.controlFromSocket(socket, 'input_' + key, false, data.defaultValue));
        }
        node.addInput(input);
    }

    _addOutput(node, data) {
        const name = data.name, socket = data.socket, key = data.key;
        const output = new Output(key, name, socket);
        if (data.hasControl) {
            node.addControl(this.controlFromSocket(socket, 'output_' + key, false, data.defaultValue));
        }
        if (data.hasPreview) {
            node.addControl(this.controlFromSocket(socket, 'preview_' + key, true));
        }
        node.addOutput(output);
    }

    builder(node) {
        this.inputData.forEach(data => this._addInput(node, data));
        this.outputData.forEach(data => this._addOutput(node, data));
    }

    worker(node, inputs, outputs) {
        let inputValues = {};
        this.inputData.forEach(data => {
            let v = undefined;
            if (inputs[data.key].length) {
                // Read data from input sockets
                v = inputs[data.key][0];
            } else if (data.hasControl) {
                // Read data from input controls
                v = node.data['input_' + data.key];
                // console.log('Reading input:', v, data.key)
            }
            inputValues[data.key] = v;
        });
        let result = this.work(inputValues);
        if (this.outputData.length == 0) return;
        if (this.outputData.length == 1) {
            // Get a single output value
            outputs[this.outputData[0].key] = result;
        } else if (typeof result === "object") {
            // Get a map of output values
            this.outputData.filter(d => result[d.key] !== undefined)
                .forEach(d => outputs[d.key] = result[d.key]);
        }
        this.outputData.forEach(data => {
            if (data.hasControl && outputs[data.key] === undefined) {
                // Read output from a control
                // console.log('Setting', data.key, node.data['output_' + data.key]);
                outputs[data.key] = node.data['output_' + data.key];
            }
            if (data.hasPreview && outputs[data.key] !== undefined) {
                // Set preview control values
                this.editor.nodes.find(n => n.id == node.id)
                    .controls.get('preview_' + data.key).setValue(outputs[data.key]);
            }
            let value = outputs[data.key];
            if (value === undefined) {
                // Warn about missing output values
                console.warn(`Node ${this.name} returned no output for ${data.key}:`, result, outputs);
            } else if (!(typeof value === "object" || typeof value === "function")) {
                outputs[data.key] = new ValueGenerator(() => value);
            }
        });
        node.data.workerResults = outputs;
    }
}

class NumComponent extends BaseComponent {

    constructor(){
        super("Number");
    }

    getOutputData() {
        return [
            this.outputData('Number', numSocket, true, false, 0),
        ];
    }
}

class DivideComponent extends BaseComponent {
    constructor() {
        super("Divide");
    }

    getInputData() {
        return [
            this.inputData('Numerator', numSocket, true),
            this.inputData('Denominator', numSocket, true),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Value', numSocket),
        ];
    }

    work(inputs) {
        return new ValueGenerator((context) => {
            const rInputs = this.reify(inputs, context);
            return rInputs.denominator == 0 ?
                Number.NaN :
                rInputs.numerator / rInputs.denominator;
        });
    }
}

class StoreComponent extends BaseComponent {
    constructor() {
        super('Store Variable');
    }

    getInputData() {
        return [
            this.inputData('Input', numSocket),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Output', numSocket),
        ];
    }

    work(inputs) {
        // TODO: Not sure at all how to handle this...
        // What should the context be? Not always null surely
        inputs = this.reify(inputs);
        return inputs.input || null;
    }
}

class ForEachComponent extends BaseComponent {
    constructor(){
        super("For Each Loop");
    }

    getInputData() {
        return [
            this.inputData('List', listSocket, true),
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
                if (list && i < list.length) return list[i++];
                return undefined;
            }
        });
        let value = new ValueGenerator(() => index, true);
        return {
            loop,
            value,
        };
    }
}

class ForRangeComponent extends BaseComponent {
    constructor(){
        super("For Range Loop");
    }

    getInputData() {
        return [
            this.inputData('From', numSocket, true),
            this.inputData('To', numSocket, true),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Loop', loopSocket),
            this.outputData('Value', numSocket, false, false),
        ];
    }

    work(inputs) {
        let index;
        let loop = new Loop((context) => {
            const rInputs = this.reify(inputs, context);
            const from = rInputs.from, to = rInputs.to;
            // console.log('Looping:', from, to);
            let i = from;
            return () => {
                index = i;
                if (i <= to) return i++;
                index = undefined;
                return undefined;
            }
        });
        let value = new ValueGenerator(() => index, true);
        return {
            loop,
            value,
        };
    }
}

class FilterComponent extends Component {
    constructor(){
        super("Filter");
    }

    builder(node) {
        var inp1 = new Input('loop',"Loop", loopSocket);
        var inp2 = new Input('filter',"Filter", predicateSocket);
        var out = new Output('loop', "Loop", loopSocket);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addControl(new ListControl(this.editor, 'preview', true))
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
        const loop = inputs['loop'][0];

        const out = loop == null ? null : new Loop(() => {
            const iterator = loop.iterator();
            return () => {
                let value;
                while ((value = iterator.next()) !== undefined) {
                    if (value >= 0) return value;
                }
                return undefined;
            }
        });
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(out);
        outputs['loop'] = out;
    }
}

export class Accumulator {
    constructor(loop, startValue, accumulate, errorValue) {
        this.accumulate = accumulate;
        this.loop = loop;
        this.startValue = startValue;
        this.errorValue = errorValue || Number.NaN;
        this.previewCurrentValue = true;
    }

    generators() {
        const loop = this.loop;
        let currentValue = this.startValue;
        const updateOnIter = [];
        if (loop) {
            loop.addStartHandler(() => currentValue = this.startValue);
            loop.addLoopHandler((v, i, context) => {
                currentValue = this.accumulate(currentValue, v, context);
                updateOnIter.forEach(gen => gen.get(context));
            });
        }
        const currentGen = new ValueGenerator(() => {
            if (!loop) return this.errorValue;
            return currentValue;
        }, true);
        if (this.previewCurrentValue) updateOnIter.push(currentGen);
        return {
            current_value: currentGen,
            final_value: new ValueGenerator((context) => {
                if (!loop) return this.errorValue;
                loop.ensureRun(context);
                if (loop.isFinished(context)) return currentValue;
                return this.errorValue;
            }),
        };
    }
}

class SumComponent extends BaseComponent {
    constructor(){
        super("Sum");
    }

    getInputData() {
        return [
            this.inputData('Loop', loopSocket),
            this.inputData('Value', numSocket),
        ];
    }

    getOutputData() {
        return [
            this.outputData('Current Sum', numSocket),
            this.outputData('Final Sum', numSocket),
        ]
    }

    work(inputs) {
        const gen = inputs.value;
        const generators = new Accumulator(inputs.loop, 0, (currentValue, newValue, context) => {
            const add = gen ? gen.get(context) : newValue;
            // console.log('Sum', context, currentValue, add, currentValue + add);
            return currentValue + add;
        }).generators();
        return {
            current_sum: generators.current_value,
            final_sum: generators.final_value,
        };
    }
}

class CountComponent extends BaseComponent {
    constructor(){
        super("Count");
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
        const generators = new Accumulator(inputs.loop, 0, (currentValue) => {
            return currentValue + 1;
        }).generators();
        return {
            current_count: generators.current_value,
            final_count: generators.final_value,
        };
    }
}

class AndComponent extends BaseComponent {
    constructor() {
        super('A and B');
    }

    getInputData() {
        return [
            this.inputData('A', boolSocket),
            this.inputData('B', boolSocket),
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
            const a = rInputs.a;
            const b = rInputs.b;
            // TODO: Should create undefined type to return
            if (a === undefined || b === undefined) return false;
            return a && b;
        });
    }
}

export const GeneralComponents = [
    new NumComponent(),
    new StoreComponent(),
    new DivideComponent(),
    new ForRangeComponent(),
    new ForEachComponent(),
    new FilterComponent(),
    new SumComponent(),
    new CountComponent(),
    new AndComponent(),
]
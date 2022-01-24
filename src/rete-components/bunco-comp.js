import { Output, Input, Component } from "rete";
import { numSocket, listSocket, loopSocket, predicateSocket } from "./sockets";
import { NumControl, ListControl, CodeControl } from "../controls/controls";
import { Loop, ValueGenerator } from "../controls/objects";
import { BaseComponent } from './general-comp';
import seedrandom from 'seedrandom';


class DieRoll extends BaseComponent {
    constructor() {
        super('Die Roll');
    }

    getOutputData() {
        return [
            this.outputData('Roll', numSocket),
        ];
    }

    work() {
        const rand = seedrandom(this.name);
        return new ValueGenerator(() => Math.floor(rand() *  6) + 1);
    }
}

class UntilRoundEndsComponent extends Component {
    constructor(){
        super("Until Round Ends");
    }

    builder(node) {

        var out = new Output('loop', 'Loop', loopSocket);
        return node
            // .addControl(inControl)
            .addOutput(out);
    }

    worker(node, inputs, outputs) {
      const out = node.data.test; //[5, -3, 7, -200, 9, -999, 10];
      // console.log(node.data, out);
    //   this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(out);
      outputs['test'] = out;
    }
}

export default [
    // new UntilRoundEndsComponent(),
    new DieRoll(),
]